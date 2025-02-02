export const isLogin = (refresh:string) => {
  if (refresh)
    return {
      redirect: { destination: "/", permanent: false },
    };

  return { props: {} };
};
