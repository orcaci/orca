
macro_rules! dispatch_to {
    ($val:expr => {$($func:ident),*}) => {
            match $val {
                $(
                    stringify!($func) => $func(),
                )*
                _ => {},
            }
    }
}