import { GetServerSideProps } from 'next';

interface HomeProps {
  message: string;
  nodeInstance: string;
  ip: string;
  localVisits: number;
  totalVisits: number;
}

export default function Home(props: HomeProps) {
  return (
    <main className="p-5">
      <h1 className="text-blue-500 text-lg font-bold">{props.message}</h1>
      <p>Node instance: <strong className="font-medium">{props.nodeInstance}</strong></p>
      <p>IP Address: <strong className="font-medium">{props.ip}</strong></p>
      <p>Local visits: <strong className="font-medium">{props.localVisits}</strong></p>
      <p>Total cluster visits: <strong className="font-medium">{props.totalVisits}</strong></p>
      <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Refresh Data
      </button>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'; // Use the environment variable
  try {
    const response = await fetch(`${backendUrl}`);
    const data = await response.json(); // Assuming the JSON structure matches the HomeProps interface

    return {
      props: data
    };
  } catch (error) {
    console.error('Failed to fetch server data:', error);
    return {
      props: {
        message: 'Failed to fetch data',
        nodeInstance: 'Error',
        ip: 'Error',
        localVisits: 0,
        totalVisits: 0
      }
    };
  }
};
