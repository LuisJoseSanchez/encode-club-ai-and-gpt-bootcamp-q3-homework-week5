import Image from "next/image";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="text-xl font-bold text-slate-600">
          Animal detection
        </h1>
        <Image
          className="rounded-3xl"
          src="/animal-detection800.png"
          alt="Animal detection picture"
          width={400}
          height={400}
          priority
        />
        <p>
          Upload an image of an animal and this aplication will detect and
          classify it in between these catagories: chamaleon, owl, tiger, zebra, bear, squirrel, rabbit, fox, canary and wolf.
        </p>
        <p>
          This app will give you a description of the animal and will tell you if it is dangerous.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Upload image
          </a>
        </div>
      </main>
      <footer className="pt-10 row-start-3 gap-8 flex-wrap items-center justify-center">
        <p>AI and GPT Bootcamp Q3 2024</p>
        <p>Homework for week 5 - Group 9</p>
      </footer>
    </div>
  );
}
