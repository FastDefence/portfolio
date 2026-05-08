export default function SNSPage() {
  return (
    <div>
      <div className="mx-4 my-4 rounded-3xl border p-6 shadow-md">
        <a
          href="https://github.com/FastDefence"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h2 className="inline-block border-b text-4xl hover:text-amber-400">
            GitHub
          </h2>

          <p className="mt-4 text-2xl">
            Username: Fastdefence
          </p>
        </a>
      </div>
      <div className="mx-4 my-4 rounded-3xl border p-6 shadow-md">
        <a
          href="https://x.com/sokusyuuuuuuuu"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h2 className="inline-block border-b text-4xl hover:text-amber-400">
            Twitter(新X)
          </h2>

          <p className="mt-4 text-2xl">
            Username: @sokusyuuuuuuuu
          </p>
        </a>
      </div>
    </div>
  );
}