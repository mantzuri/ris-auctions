import { useEffect, useState } from "react";

import { checkUserIsAdmin } from "$utils/firebase";

const useCheckIfUserAdmin = () => {
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const admin = await checkUserIsAdmin();
      setUserIsAdmin(admin);
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return userIsAdmin;
};

export default useCheckIfUserAdmin;