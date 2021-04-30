use std::process::Command;
use std::env;

// Compile and link the go library to access the Firebase API
fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();

    // First compile the library
    let output = Command::new("./firebaseConnector/build.sh")
        .arg(&out_dir)
        .output()
        .expect("Could not build Go Firebase library");

    println!("{}", String::from_utf8_lossy(&output.stderr));

    // Statically link it to the rust project
    let lib = "firebase";

    println!("cargo:rerun-if-changed=./firebaseConnector/firebaseConnector.go");
    println!("cargo:rustc-link-search=native={}", out_dir);
    println!("cargo:rustc-link-lib=static={}", lib);
}