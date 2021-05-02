use std::error::Error;
use std::ffi::{CStr, CString};
use std::fmt;
use std::fmt::Formatter;
use std::os::raw::c_char;

mod firebase_library {
    use std::os::raw::c_char;

    #[repr(C)]
    pub struct GoString {
        pub a: *const c_char,
        pub b: i64,
    }

    //noinspection RsStructNaming
    #[repr(C)]
    pub struct verifyIDToken_return {
        pub uuid: *const c_char,
        pub email: *const c_char,
        pub error: *const c_char,
    }

    #[link(name = "firebase")]
    extern "C" {
        pub fn initialize() -> *const c_char;
        pub fn verifyIDToken(_: GoString) -> verifyIDToken_return;
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

/// Converts a C String to a Rust String
///
/// The C String pointer should be null terminated, use UTF-8, and not be null. A new Rust String
/// will be created based on it and the C String pointer will be freed.
///
/// IMPORTANT: Because the C String pointer is freed, it should not be used again after a call to
/// this function.
unsafe fn convert_c_string_to_rust_string(c_string: *const c_char) -> Result<String, impl Error> {
    assert!(!c_string.is_null());

    // Convert the pointer to a Rust String
    let rust_string = CStr::from_ptr(c_string).to_str().map(String::from);
    // Free the memory of the pointer
    libc::free(c_string as *mut libc::c_void);

    rust_string
}

pub fn initialize() -> Result<(), Box<dyn Error>> {
    let status;

    // Call the Go function (exposed as a C library) initialize()
    // The function returns a pointer to a C string representing the status. This pointer should not
    // be null because there is no path in the Go code where such thing happens. This C string is
    // immediately converted to a Rust string and the pointer of the C string is manually freed.
    unsafe {
        let status_ptr = firebase_library::initialize();
        status = convert_c_string_to_rust_string(status_ptr)?;
    }

    if status.is_empty() {
        Ok(())
    } else {
        Err(Box::new(FirebaseError { message: status }))
    }
}

pub fn verify_id_token(id_token: &str) -> Result<(String, String), Box<dyn Error>> {
    // Convert the idToken to a Go String
    let c_uuid = CString::new(id_token)?;
    let c_uuid_ptr = c_uuid.as_ptr();
    let go_uuid = firebase_library::GoString {
        a: c_uuid_ptr,
        b: c_uuid.as_bytes().len() as i64
    };

    let uuid;
    let email;
    let error;

    // Call the Go function (exposed as a C library) verifyIDToken()
    // The function returns a struct containing C String pointers to the results. These pointer
    // should not be null because there is no path in the Go code where such thing happens.
    // These C strings are immediately converted to Rust Strings and the pointer of the C strings
    // are manually freed.
    unsafe {
        let verify = firebase_library::verifyIDToken(go_uuid);

        uuid = convert_c_string_to_rust_string(verify.uuid)?;
        email = convert_c_string_to_rust_string(verify.email)?;
        error = convert_c_string_to_rust_string(verify.error)?;
    }

    if error.is_empty() {
        Ok((uuid, email))
    } else {
        Err(Box::new(FirebaseError{message: error}))
    }
}
