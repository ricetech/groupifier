use std::error::Error;
use std::ffi::CStr;
use std::fmt;
use std::fmt::Formatter;
use std::os::raw::c_char;
use std::str::Utf8Error;

extern "C" {
    fn initialize() -> *const c_char;
}

#[derive(Debug)]
pub struct FirebaseError {
    message: String,
}

impl Error for FirebaseError {}

impl fmt::Display for FirebaseError {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

unsafe fn convert_to_str<'a>(char_ptr: *const c_char) -> Result<String, Utf8Error> {
    let c_str = CStr::from_ptr(char_ptr);
    c_str.to_str().and_then(|s| Ok(String::from(s)))
}

pub fn initialize_firebase() -> Result<(), Box<dyn Error>> {

    let status_ptr = unsafe { initialize() };
    let status = unsafe { convert_to_str(status_ptr) };

    match status {
        Err(e) => Err(Box::new(e)),
        Ok(s) if s  == "" => Ok(()),
        Ok(e) => Err(Box::new(FirebaseError { message: e })),
    }
}
