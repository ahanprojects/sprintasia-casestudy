# sprintasia-casestudy

## 1. Logical Test (Go)
### How to run: 
1. Go to `logical-test` directory.
2. Run `go run main.go`

## 2. System Flow
- Frontend: React, Vite
- Backend: Go, Gin, Gorm
- Database: Online PostgreSQL (ElephantSQL)
### How to run:

#### Backend
1. Go to `system-flow/backend`
2. Setup .env `PORT` and `DB_URL`. See GORM documentation for more detail about the database setup.
2. Build with `go build`
3. Run `.\motion.exe`
4. The backend will be hosted in `PORT`

#### Frontend
1. Go to `system-flow/frontend`
2. Run `npm i` to install the dependencies
3. Run `npm run build`
4. Run `npm run preview`
5. Go to browser and open the link
6. Run `npm run dev` for development
