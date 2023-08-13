# Swaggipedia 
## Lightweight open-source platform for browsing swagger APIs.

Swaggipedia provides a simple REST API alongside a user-friendly UI to manage and browse your APIs.

-----------------------------------------------------
## Quick View
![swaggipedia](https://github.com/PayU/swaggipedia/assets/11981986/3c61e142-c115-4977-b206-5c30c815a4ab)

<br/>
<br/>

## How to use Swaggipedia

### **Step 1**: start a swaggipedia server instance
Swaggipedia is production ready and can be deployed using Docker. Starting an instance is simple:
```sh
docker run -d -p 3000:3000 --name my-swaggipedia zooz/swaggipedia
```

**Configuring Swaggipedia**:
> There are a small number of environment variables supported by the image:
> - **DATABASE_TYPE**: *One of: 'sqlite' (Default) | 'mysql' | 'postgres' | 'mariadb' | 'mssql' | 'oracle'.*
> - **DATABASE_ADDRESS**: *The host of the database.*
> - **DATABASE_NAME**: *The name of the database.*
> - **DATABASE_USERNAME**: *The username used to authenticate against the database.*
> - **DATABASE_PASSWORD**: *The password used to authenticate against the database. Supports SQLCipher encryption for SQLite.*
> - **APP_BASE_NAME**: *Enables tweaking the public folder containing the HTML file (Swaggipedia UI).*

<br/>

### **Step 2**: manage the swagger files using swaggipedia API
Swaggipedia provides a super simple REST API to get/create/update/delete swagger files. [API Reference](https://github.com/PayU/swaggipedia/blob/master/src/swagger.yaml)

<br/>

### **Step 3**: browse your swagger using swaggipedia UI
```<YOUR_SERVER_URL>/ui```