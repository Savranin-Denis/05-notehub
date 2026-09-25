import { Hourglass } from 'react-loader-spinner';

export default function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <Hourglass
        visible={true}
        height="80"
        width="80"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={['#306cce', '#72a1ed']}
      />
    </div>
  );
}
