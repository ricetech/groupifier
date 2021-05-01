use std::env;
use std::process::Command;

// Compile and link the Go library to access the Firebase API
fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();

    // First compile the library
    let go_output = Command::new("./firebaseConnector/build.sh")
        .arg(&out_dir)
        .output()
        .unwrap();

    println!("{}", String::from_utf8_lossy(&go_output.stdout));
    println!("{}", String::from_utf8_lossy(&go_output.stderr));

    // Fail the build if the Go library didn't compile
    if !go_output.status.success() {
        panic!("Go Firebase library failed to compile: {}", String::from_utf8_lossy(&go_output.stderr))
    }

    // Statically link it to the rust project
    let lib = "firebase";

    println!("cargo:rerun-if-changed=./firebaseConnector/firebaseConnector.go");
    println!("cargo:rustc-link-search=native={}", out_dir);
    println!("cargo:rustc-link-lib=static={}", lib);
}
