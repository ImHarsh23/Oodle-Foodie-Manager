import Loading from "../Loading/Loading";

const FullPageLoading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-white">
      <Loading loader={false}>
        <img
          width={350}
          src="https://cdn.dribbble.com/users/107759/screenshots/3765434/media/2a9e65dfe3ada04698274e30d8fd7e6d.gif"
          alt="Loading"
        />
      </Loading>
    </div>
  );
};

export default FullPageLoading;
