function Profile() {
  return (
      <img
          src="https://i.imgur.com/MK3eW3As.jpg"
          alt="Katherine Johnson"
      />
  );
}

export default function Home() {
  return (
      <main>
        <>
          <h1>Hedy Lamar's Todos</h1>
          <img
              src="https://i.imgur.com/yXOvdOSs.jpg"
              alt="Hedy Lamarr"
              className="w-40 h-40 rounded-full object-cover"
          />
          <ul className="list-disc pl-6">
            <li>Invent new traffic lights</li>
            <li>Rehearse a movie scene</li>
            <li>Improve spectrum technology</li>
          </ul>
        </>
      </main>
  );
}
