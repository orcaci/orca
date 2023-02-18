

use rand::{distributions::Alphanumeric, thread_rng, Rng};
use rand::distributions::DistString;


pub fn short_uuid() -> String {
    Alphanumeric.sample_string(&mut rand::thread_rng(), 8)
}

pub fn request_uuid() -> String {
    format!("Rid{}", Alphanumeric.sample_string(&mut rand::thread_rng(), 32))
}