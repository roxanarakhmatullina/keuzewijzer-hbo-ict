# Keuzewijzer HBO-ICT
Keuzewijzer HBO-ICT is a project that helps students from the study HBO-ICT on Windesheim (Zwolle) to help simplifying to choose semesters during their study.
Showing a in-depth route from start of the study to graduation, should help the students get a clear overview of their study and which semesters they can follow to graduate to a specific profile.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Cloning the repository
1. Copy the HTTPS link from the repository
2. Open GitHub Desktop
3. Click on "Current Repository" in the top left corner
4. Click on "Add" in the dropdown menu
5. Click on "Clone Repository"
6. Paste the HTTPS link in the "Repository URL" field
7. Choose a local path where you want to clone the repository
8. Click on "Clone"

### Installing Dependencies
After cloning the repository it has 3 projects in one

#### Client & Dashboard
For the client/dashboard you need to install it's dependencies
1. Open a terminal
2. Navigate to the client/dashboard folder
3. Run `npm install`
4. Run `npm run dev` to run the development

#### Server
For the server you need to install it's dependencies
1. Open a terminal
2. Navigate to the server folder
3. run `python -m venv myenv` to create a virtual environment
3. run `source myenv/bin/activate` to activate the virtual environment
4. Run `pip install -r requirements.txt` to install the dependencies
5. Run `python manage.py runserver` to run the development

#### Connect Client/Dashboard with Server
1. Open the client/dashboard folder
2. Add a `.env.local` file
3. Copy the content from `.env.example` file
4. Change the "NEXT_PUBLIC_API_URL" to the server API url (e.g. http://localhost:8000/api/)
5. Save the file

