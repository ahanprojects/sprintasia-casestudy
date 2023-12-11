# sprintasia-casestudy

## 1. Logical Test (Go)
### How to run: 
1. Go to `logical-test` directory.
2. Run `go run main.go`

## 2. System Flow
- Frontend: React, Vite, Zod for validation
- Backend: Go, Gin, Gorm
- Database: Online PostgreSQL (ElephantSQL)
### How to run:

#### Backend
1. Go to `system-flow/backend`
2. Setup .env `PORT` and `DB_URL`. See GORM documentation for more detail about the database setup.
2. Run migration with `go run migrate.go` in the `migrate` folder
3. Build with `go build`
4. Run `.\motion.exe`
5. The backend will be served in `PORT`

#### Frontend
1. Go to `system-flow/frontend`
2. Run `npm i` to install the dependencies
3. Run `npm run build`
4. Run `npm run preview`
5. Go to browser and open the link
6. Run `npm run dev` for development

##### Screenshots
Active Tasks
![image](https://github.com/ahanprojects/sprintasia-casestudy/assets/68496198/e84e08ff-32bf-4eb6-a6ed-21427bc45d08)

Completed Tasks
![image](https://github.com/ahanprojects/sprintasia-casestudy/assets/68496198/f66eb915-9e30-4379-99e3-c2279934d3cc)

New Task
![image](https://github.com/ahanprojects/sprintasia-casestudy/assets/68496198/21c0ff90-e1e6-4772-9825-42120fd89963)

New Subtask (Example when inputs are empty)
![image](https://github.com/ahanprojects/sprintasia-casestudy/assets/68496198/17b2f107-37c9-44c8-9b13-1f802c0b06b2)

Edit Task
![image](https://github.com/ahanprojects/sprintasia-casestudy/assets/68496198/63b7f537-5f78-4571-bfc5-823254ab43db)

