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
  app.Put("/customer/ban/:id",BanCustomer)
  app.Put("/customer/unban/:username",UnBanCustomer)
  app.Put("/customer/update/:id",UpdateCustomer)
  app.Post("/customer/login",LoginCustomer)
  
  //staff
  app.Get("/staff/username/:username",GetStaffByusername)
  app.Get("/staff/id/:id",GetStaffByID)
  app.Post("/staff/create",CreateStaff) 
  app.Put("/staff/ban/:username",BanStaff)
  app.Put("/staff/unban/:username",UnBanStaff)
  app.Put("/staff/update/:id",UpdateStaff)
  app.Post("/staff/login",LoginStaff)



  app.Get("/product/id/:id", GetProductByID)
	app.Get("/products", GetProducts)
	app.Get("/products/active", GetProductsActive)
	app.Post("/product/create", CreateProduct)
	app.Put("/product/update/:id", UpdateProduct)
	app.Delete("/product/inactive/:id", inActiveProduct)
	app.Put("/product/active/:id", ActiveProduct)

  
	//order
	app.Post("/order/create", CreateOrder)
	app.Get("/orders", GetOrders)
	app.Get("/order/customer/:id", GetOrdersByCustomerID)
	app.Put("/order/update/slip", UpdateOrderSlip)
	app.Put("/order/update/status", UpdateOrderStatus)

	//receipt
	app.Post("/receipt/create", CreateReceipt)
	app.Get("/receipts/customer/:id", GetReceiptByCustomerId)
	app.Put("/receipts/finish/:id", UpdateReceiptStatus)


  app.Post("/bid/attempt", BidAttempt)
	app.Get("/bid/product/:id", GetBidsByProductID)
	app.Get("/bid/highest/:id", GetHighestBidByProductID)
	app.Get("/bid/winner/:id", GetAuctionWinnerByProductID)

  
  app.Get("/hi",func(c *fiber.Ctx) error { return c.SendString("hi")})

  app.Listen(":8080")
}




