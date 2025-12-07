import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ThumbnailPostProps {
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  thumbnailUrl: string;
  linkUrl: string;
}

export function ThumbnailPost({ title, description, createdAt, createdBy, updatedAt, thumbnailUrl, linkUrl }: ThumbnailPostProps) {
  return (
    <Card className="w-full rounded-none border-none shadow-none">
      <CardContent className="flex flex-row items-start justify-start gap-4">
        <div className="flex-[3] flex-col items-start justify-start">
          <CardTitle className="text-2xl font-bold line-clamp-2 mb-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3 mb-2">{description}</CardDescription>
          <CardFooter className="p-0">
            <span className="text-sm text-muted-foreground">{createdAt} · {createdBy}</span>
          </CardFooter>
        </div>
        <img src={thumbnailUrl} alt={title} className="flex-[1] w-[130px] h-[90px] rounded-lg object-cover" />
      </CardContent>
    </Card>
  )
}