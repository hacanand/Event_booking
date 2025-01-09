// export async function PUT(req: NextRequest, res: NextResponse) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { clerkId } = body;
//     const user = await User.findOneAndUpdate({ clerkId }, body, {
//       new: true,
//     });
    