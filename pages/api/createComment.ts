// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from "../../sanity";

type Data = {
  message: string, 
  err?: any
}

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { _id, name, email , comment } = JSON.parse(req.body); 
  try {
    await sanityClient.create({
      _type: "comment", 
      post: {
        _type: "reference", 
        _ref: _id
      }, 
      name, 
      email, 
      comment
    })
  } catch(err) {
    return res.status(500).json({ message: "Something went wrong ", err });
  }

  res.status(200).json({ message: "Comment submitted" });
}
