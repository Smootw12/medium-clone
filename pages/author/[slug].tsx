import { GetStaticProps } from "next";
import Link from "next/link";
import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Author, Post } from "../../lib/typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  author: Author;
  posts: [Post];
}

const Author = ({ author, posts }: Props) => {
  console.log(author, posts);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
  return (
    <div>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(author.banner).url()!}
      />
      <div className="max-w-4xl mx-auto p-5">
        <div className="flex space-x-7 py-5">
          <h1 className="text-5xl font-bold">{author.name}</h1>
          <img
            className="h-16 w-16 rounded-full"
            src={urlFor(author.image).url()!}
          />
        </div>
        <div className="flex space-y-5 flex-col">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={author.bio}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text xl font-bald my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              links: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              blockquote: (props: any) => (
                <p className="text-small font-extralight my-5" {...props} />
              ),
            }}
          />
        </div>
        <p className="font-extralight text-sm py-5">
          - Account created at{" "}
          <span className="text-green-500">
            {new Date(author._createdAt).toLocaleString()}
          </span>
        </p>
        <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />{" "}
        <p className="text-base">
          posts created by <span className="text-green-500">{author.name}</span>
          :
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 p-2 md:p-4">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="border rounded-lg group cursor-pointer overflow-hidden">
                <img
                  src={urlFor(post.mainImage).url()!}
                  className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                />
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
        {submitted ? (
          <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold">
              Thank you for committing the comment!
            </h3>
            <p>Once is been approved, it will appear below!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          >
            <h3 className="text-sm text-yellow-500">
              What do you think about this author?
            </h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2" />

            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={author._id}
            />
            <label className="block mb-5">
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-inpunt mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                type="text"
                placeholder="John Appleseed"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadow border rounded py-2 px-3 form-inpunt mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                type="email"
                placeholder="John Appleseed"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                rows={8}
                placeholder="John Appleseed"
              />
            </label>
            <div className="flex flex-col p-5">
              {errors.name && (
                <span className="text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.email && (
                <span className="text-red-500">
                  - The Email Field is required
                </span>
              )}
            </div>

            <button
              type="submit"
              className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Submit
            </button>
          </form>
        )}
        <div className="flex flex-col p-10 my-1 max-w-2xl mx-auto shadow-yellow-500 space-y-2 shadow">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />

          {author.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}:</span>{" "}
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Author;

export const getStaticPaths = async () => {
  const query = `*[_type == "author"] {
    _id,
    slug {
      current
    }
  }`;
  const authors = await sanityClient.fetch(query);
  const paths = authors.map((author: Author) => ({
    params: {
      slug: author.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const authorQuery = `*[_type == "author" && slug.current == "${params?.slug}"][0]{
    _createdAt,
    _id,
    banner,
    bio,
    image,
    name,
    'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
  }`;
  const author: Author = await sanityClient.fetch(authorQuery);
  const postsQuery = `*[_type == "post" && author._ref == "${author?._id}"]`;
  const posts = await sanityClient.fetch(postsQuery);
  if (!posts) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      author,
      posts,
    },
    revalidate: 60,
  };
};
