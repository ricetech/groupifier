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
pub struct FirebaseError<'a> {
    message: &'a str,
}

impl Error for FirebaseError<'_> {}

impl fmt::Display for FirebaseError<'_> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

unsafe fn convert_to_str<'a>(char_ptr: *const c_char) -> Result<&'a str, Utf8Error> {
    let c_str = CStr::from_ptr(char_ptr);
    c_str.to_str()
}

pub fn initialize_firebase() -> Result<(), Box<dyn Error>> {
    let status_ptr = unsafe { initialize() };
    let status = unsafe { convert_to_str(status_ptr) };

    match status {
        Err(e) => Err(Box::new(e)),
        Ok("") => Ok(()),
        Ok(e) => Err(Box::new(FirebaseError { message: e })),
    }
}
