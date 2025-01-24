// 'use client'
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { AlertTriangle } from "lucide-react";
// import { NextPageContext } from "next";
// interface ErrorPageProps {
//   statusCode: number;
// }

// export default function ErrorPage({ statusCode }: ErrorPageProps) {
//   const router = useRouter();

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
//         <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           {statusCode ? `Error ${statusCode}` : "Something went wrong."}
//         </h1>
//         <p className="text-gray-600 mb-4">
//           {statusCode === 404
//             ? "The page you are looking for was not found."
//             : "An unexpected error has occurred."}
//         </p>
//         <div className="flex justify-center space-x-4">
//           <button
//             onClick={() => router.back()}
//             className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
//           >
//             Go Back
//           </button>
//           <Link
//             href="/"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



// ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
//   const statusCode = res?.statusCode || err?.statusCode || 500;
//   return { statusCode };
// };
