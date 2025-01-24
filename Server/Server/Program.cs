using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Server.Data;
using Server.Services;
using Swashbuckle.AspNetCore.Filters;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env.local
Env.Load(".env.local");

// Add environment variables to configuration
builder.Configuration.AddEnvironmentVariables();

// Configure CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000",
                    "http://localhost:3001",
                    "https://keuzewijzerhboict.nl",
                    "http://keuzewijzerhboict.nl",
                    "http://keuzewijzerhboict.nl:3001",
                    "https://keuzewijzerhboict.nl:3001",
                    "https://keuzewijzerhboict.nl:3000",
                    "http://keuzewijzerhboict.nl:3000")
                .WithMethods("GET", "POST", "DELETE")
                .AllowAnyHeader()
                .AllowCredentials(); // Enable credentials support
        });
});


var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT_SECRET environment variable is not set.");
}

var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
        };
    });

// Add services to the container
builder.Services.AddScoped<UserSeeder>();
builder.Services.AddControllers();

// Configure database connection string
builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("CONNECTION_STRING") ?? builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<StudyRouteService>();

// Swagger setup for API
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme()
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Configure Identity
builder.Services.AddIdentityCore<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Apply migrations and seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<DataContext>();

        // Check if database exists and if it requires migration
        if (context.Database.GetPendingMigrations().Any())
        {
            // Apply pending migrations
            await context.Database.MigrateAsync();
        }

        // Seed the database with initial data
        var seeder = services.GetRequiredService<UserSeeder>();
        await seeder.SeedRootUserAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins); // Ensure this comes before authentication and authorization

app.UseAuthentication(); // JWT authentication
app.UseAuthorization();

app.MapControllers();

app.Run();