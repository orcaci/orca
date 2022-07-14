// import React, { useState } from "react";
// import { Form, Input, Button, message } from "antd";
// import styles from "./login.module.css";
// import { Link, useHistory } from "react-router-dom";
// import { LockClosedIcon } from "@heroicons/react/solid";

// export function Login() {
//   const history = useHistory();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const onFinish = async (values: { username: string; password: string }) => {
//     try {
//       values.password = btoa(values.password);
//       localStorage.setItem("loggedIn", "true");
//       history.push("/home");
//       // const result = await axios.post("/api/user/login", values);
//       // console.log(result.data);
//       // if (!result.data.success) {
//       //   message.error("Login failed");
//       // } else {
//       //   localStorage.setItem("loggedIn", "true");
//       //   import("../main").then(({ Mainpage }) => ({
//       //     default: Mainpage
//       //   }));
//       //   // message.success("Login successfull");
//       // }
//     } catch (error) {
//       message.error(`Login failed! Error: ${error}`);
//     }
//   };
//   return (
//     <>
//       {/*
//         This example requires updating your template:

//         ```
//         <html class="h-full bg-gray-50">
//         <body class="h-full">
//         ```
//       */}
//       <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <img
//               className="mx-auto h-12 w-auto"
//               src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
//               alt="Workflow"
//             />
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Sign in to your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Or{" "}
//               <a
//                 href="#"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 start your 14-day free trial
//               </a>
//             </p>
//           </div>
//           <form className="mt-8 space-y-6" action="#" method="POST">
//             <input type="hidden" name="remember" defaultValue="true" />
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email-address" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="remember-me"
//                   className="ml-2 block text-sm text-gray-900"
//                 >
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a
//                   href="#"
//                   className="font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <LockClosedIcon
//                     className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
//                     aria-hidden="true"
//                   />
//                 </span>
//                 Sign in
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
//   // return (
//   //   <div className={styles.login}>
//   //     <Form layout="vertical" onFinish={onFinish}>
//   //       <h1>Login</h1>
//   //       <Form.Item name="email" label="Email" required>
//   //         <Input
//   //           autoComplete="off"
//   //           onChange={(e) => setEmail(e.target.value)}
//   //         />
//   //       </Form.Item>
//   //       <Form.Item name="password" label="Password" required>
//   //         <Input
//   //           type={"password"}
//   //           onChange={(e) => setPassword(e.target.value)}
//   //         />
//   //       </Form.Item>
//   //       <div className={styles.footer}>
//   //         <Link to="/forgotpassword">Forgot Password</Link>
//   //         <Button
//   //           type="primary"
//   //           htmlType="submit"
//   //           disabled={!(email && password)}
//   //         >
//   //           Login
//   //         </Button>
//   //       </div>
//   //     </Form>
//   //   </div>
//   // );
// }

/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Login() {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
