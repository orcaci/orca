pub mod s3;

pub trait StorageTrait {
    fn create_bucket();
    fn upload();
    fn delete(self, key: String);
}


pub struct StorageClient {

}
