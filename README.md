# License

Copyright 2024 Mantek Singh (MantekS). All rights reserved.  
This repository is for viewing only. Copying, modifying, or distributing is prohibited without permission.  

# Steps

1. Download and install Docker.  
   Links: https://docs.docker.com/desktop/setup/install/windows-install/, https://www.docker.com/products/docker-desktop/  
2. Turn on Hyper-V or WSL in "Turn Windows features on or off" (Restart might be required).    
3. Run Docker.  
4. Open CMD or custom Docker CLI.  
5. Make sure docker is running using the following command:  
   docker -v (check current Docker version)  
6. Download Vuln Project files as a zip file from GitHub and extract them in the folder of your choice.  
7. Go to the project folder using the following command:  
   cd path_to_project (enter your path instead of "path_to_project")  
8. Build a project image using the following command:  
   docker build -t vuln-project .  
9. Run Vuln Project at localhost:3000 using the following command:  
   docker run -p 127.0.0.1:3000:3000 vuln-project  
