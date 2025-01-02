import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";

interface Notice {
  id: string;
  title: string;
  description: string;
}

function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() =>{
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/v1/notices/getAllNotice');
        if(!response.ok){
          throw new Error("Failed to fetch notices");
        }
        const data = await response.json();
        setNotices(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <Card className={cn("w-full max-w-md mx-auto")}>
      <CardHeader className={cn("bg-gradient-to-r from-teal-500 to-teal-600 text-white")}>
        <CardTitle className={cn("text-2xl font-bold text-center")}>Latest Notices</CardTitle>
        <p className={cn("text-center text-sm text-teal-100 mt-2")}>Check out the latest updates and notifications.</p>
      </CardHeader>
      <CardContent className={cn("p-4")}>
        {loading ? (
          <p className={cn("text-center text-gray-500")}>Loading...</p>
        ) : error ? (
          <p className={cn("text-center text-red-500")}>{error}</p>
        ) : notices.length > 0 ? (
          <div className={cn("space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide")}>
            {notices.map((notice) => (
              <div key={notice.id} className={cn("bg-white p-4 rounded-lg shadow-md border border-gray-200")}>
                <h3 className={cn("font-semibold text-gray-900 mb-2")}>{notice.title}</h3>
                <p className={cn("text-gray-600 text-sm")}>{notice.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={cn("text-center text-gray-500")}>No notices available.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default Notices;