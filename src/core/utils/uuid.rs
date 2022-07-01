use rand::{distributions::Alphanumeric, thread_rng, Rng};


pub fn short_uuid() -> String {
    thread_rng().sample_iter(&Alphanumeric).take(8).collect()
}

pub fn request_uuid() -> String {
    format!("Rid{}", thread_rng().sample_iter(&Alphanumeric).take(32).collect::<String>())
}