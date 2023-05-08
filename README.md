
# Nurture-Nest

Nurture-Nest allows a user to manage their child with their meal plans, vaccine history and doctor appointments. Moreover, it is also a nanny hiring platform where once the nanny is assigned, the user(parent) can chat with the nanny to give instructions etc. The nanny would also be able to view the details of a child (meal plans, vaccines and doctor appointments) making it easier to take care of the child without remembering a lot of stuff making the life of both parent and the nanny easier.

This project is developed by Group Status 418. 

### Requirements

Both Server and Client side require .env file which the team 'Status 418' must have provided seperately. If you face issues accessing the same, please contact the team!

You would also have to install ImageMagick on your machine to make things work as it is one of our independent technologies that we have used in our project. 
Below are the links to download the same:

Windows: https://imagemagick.org/script/download.php#windows

Mac: https://imagemagick.org/script/download.php#macosx

Lastly, make sure that you have all the Microsoft's Visual Studio C++ reditributable latest packages downloaded on your machine.

For reference, visit https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170 

## Available Scripts

In the project directory, you can open an integrated terminal on both client and server and run the following commands:

### `npm install`

Installs all the dependencies used in the app

### `npm start`

Runs the server in the development mode on localhost:3000 and the client on localhost:8081

The Client should start itself on [http://localhost:8081](http://localhost:8081)
This will land you to our homepage.

Once landed to the homepage, nanny will be be shown a dashboard where she can see the assigned children to her (Max Children: 2, that too if they belong to the same family).

By clicking on a child, nanny will be able to see all the child details in a read-only mode. 
If no children is assigned to her yet or she is a fresh user, she will be asked to go to the career page and apply to jobs first.

Parent side would see a different dashboard where they would be able to add their child and add their child details and would have full write-access to it to add or make changes

Parent side would also be able to hire nannies through the job portal. 

Both the parent side and nanny side would have a chat functionality to chat with each other to give instructions to the nanny or take updates from nanny. 

### Database - Mongo SRV URL

mongodb+srv://swarajsingpatil:Password%401@cluster0.68unpvh.mongodb.net/test
 
## NOTE

Nanny can only see child details when the child is assigned to her ie. only if she is hired for the job posted by a parent

Nanny as a user CANNNOT do the following functions:

* Edit Meal Plans 
* Edit Due Vaccines or Vaccine History
* Edit Doctor's Appointments

For a nanny, all the child details will be read-only.
