# Keuzewijzer HBO-ICT
Keuzewijzer HBO-ICT is a project that helps students from the study HBO-ICT on Windesheim (Zwolle) to simplify choosing semesters during their study.
Showing an in-depth route from the start of the study to graduation should help students get a clear overview of their study and which semesters they can follow to graduate to a specific profile.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Cloning the Repository
1. Copy the HTTPS link from the repository.
2. Open GitHub Desktop.
3. Click on "Current Repository" in the top left corner.
4. Click on "Add" in the dropdown menu.
5. Click on "Clone Repository."
6. Paste the HTTPS link in the "Repository URL" field.
7. Choose a local path where you want to clone the repository.
8. Click on "Clone."

### Installing Dependencies
After cloning the repository, it has 3 projects in one.

#### Client & Dashboard
For the client/dashboard, you need to install its dependencies:
1. Open a terminal.
2. Navigate to the client/dashboard folder.
3. Run `npm install`.
4. Run `npm run dev` to start the development server.

#### Server
For the server, you need to install its dependencies:
1. Open a terminal.
2. Navigate to the server folder.
3. Run `dotnet restore` to install the dependencies.
4. Run `dotnet run` to start the development server.

#### Connect Client/Dashboard with Server
1. Open the client/dashboard folder.
2. Add a `.env.local` file.
3. Copy the content from `.env.example`.
4. Change the "NEXT_PUBLIC_API_URL" to the server API URL (e.g., `http://localhost:5125/api/`).
5. Save the file.



