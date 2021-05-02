use std::error::Error;
use std::ffi::CStr;
use std::fmt;
use std::fmt::Formatter;

mod firebase_library {
    use std::os::raw::c_char;

    #[link(name = "firebase")]
    extern "C" {
        pub fn initialize() -> *const c_char;
    }
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

pub fn initialize() -> Result<(), Box<dyn Error>> {
    let status;

    // Call the Go function (exposed as a C library) initialize()
    // The function returns a pointer to a C string representing the status. This pointer should not
    // be null because there is no path in the Go code where such thing happens. This C string is
    // immediately converted to a Rust string and the pointer of the C string is manually freed.
    unsafe {
        let status_ptr = firebase_library::initialize();

        // Convert the above pointer to a proper Rust String
        status = CStr::from_ptr(status_ptr).to_str().map(String::from);
        // Free the passed pointer
        libc::free(status_ptr as *mut libc::c_void);
    }

    match status {
        Ok(s) if s.is_empty() => Ok(()),
        Err(e) => Err(Box::new(e)),
        Ok(e) => Err(Box::new(FirebaseError { message: e })),
    }
}
