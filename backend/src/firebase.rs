use std::ffi::{CStr};
use std::os::raw::c_char;

extern "C" {
    fn initialize() -> *const c_char;
}

unsafe fn convert_to_str<'a>(char_ptr: *const c_char) -> &'a str {
    let c_str = CStr::from_ptr(char_ptr);
    return c_str.to_str().expect("Error converting c_str to Rust string");
}

pub fn initialize_firebase() {
    let status_ptr = unsafe { initialize() };
    let status = unsafe { convert_to_str(status_ptr) };

    if status != "" {
        panic!("Error Initializing Firebase: {}", status)
    }
}