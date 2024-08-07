const FullPageLoading = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-white">
      <div className="w-48 overflow-hidden object-cover">
        <img
          className="scale-150"
          src="https://cdn.dribbble.com/users/107759/screenshots/3765434/media/2a9e65dfe3ada04698274e30d8fd7e6d.gif"
          alt="Loading"
        />
      </div>
      <h1 className="text-center text-2xl font-bold">OODLE</h1>
    </div>
  );
};

export default FullPageLoading;
