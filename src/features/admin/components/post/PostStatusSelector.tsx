import { PostStatus } from "@/src/features/admin/posts/types";
import { Select } from "@/src/components/Select";

interface PostStatusSelectorProps {
  status: PostStatus;
  onStatusChange: (status: PostStatus) => void;
}

export const PostStatusSelector = ({ status, onStatusChange }: PostStatusSelectorProps) => (
  <div className="space-y-2 min-w-[150px]">
    <label htmlFor="post-status-select" className="text-sm font-mono font-medium text-foreground/40">Status</label>
    <Select
      id="post-status-select"
      value={status}
      onChange={(e) => onStatusChange(e.target.value as PostStatus)}
      className="w-full bg-transparent border-b border-border py-2 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer transition-colors [&>option]:bg-background [&>option]:text-foreground"
    >
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
      <option value="TRASHED">Trashed</option>
    </Select>
  </div>
);
