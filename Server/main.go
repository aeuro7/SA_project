package main

import (
	"database/sql"
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
  "github.com/gofiber/fiber/v2/middleware/cors"

)

const (
  DBhost     = "localhost"  // or the Docker service name if running in another container
  DBport     = 5432         // default PostgreSQL port
  DBuser     = "myuser"     // as defined in docker-compose.yml
  DBpassword = "mypassword" // as defined in docker-compose.yml
  DBname   = "SA_DB_1" // as defined in docker-compose.yml
)

var db *sql.DB

func setupDB() *sql.DB {
  psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    DBhost, DBport, DBuser, DBpassword, DBname)

  // Open a connection
  sdb, err := sql.Open("postgres", psqlInfo)
  if err != nil {
    log.Fatal(err)
  }
  return sdb
}


func main() {
  // Connection string
  defer db.Close()  
  db = setupDB()
  
  app := fiber.New()

  app.Use(cors.New(cors.Config{
		AllowMethods: "GET,POST,HEAD,PUT,DELETE", }))

  //customer
  app.Get("/customer/username/:username",GetCustomerByusername)
  app.Get("/customer/id/:id",GetCustomerByID)
  app.Post("/customer/create",CreateCustomer) 
  app.Put("/customer/updatepassword/:username/:password",UpdateCustomer)
  app.Put("/customer/ban/:username",BanCustomer)
  app.Put("/customer/unban/:username",UnBanCustomer)
  
  //staff
  app.Get("/staff/username/:username",GetStaffByusername)
  app.Get("/staff/id/:id",GetStaffByID)
  app.Post("/staff/create",CreateStaff) 
  app.Put("/staff/updatepassword/:username/:password",UpdateStaff)
  app.Put("/staff/ban/:username",BanStaff)
  app.Put("/staff/unban/:username",UnBanStaff)

  
  app.Get("/hi",func(c *fiber.Ctx) error { return c.SendString("hi")})

  app.Listen(":8080")
}




