import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data); // response.data가 useSWR의 data가 된다.

export default fetcher;
