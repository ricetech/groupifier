#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use rocket_contrib::databases::diesel;

mod firebase;

#[database("postgres_db")]
struct DbConn(diesel::PgConnection);

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn main() {
    match firebase::initialize_firebase() {
        Ok(_) => { println!("Successfully initialized Firebase API") }
        Err(e) => { panic!("Could not initialize Firebase API: {}", e.to_string()) }
    }

    rocket::ignite()
        .mount("/", routes![index])
        .attach(DbConn::fairing())
        .launch();
}