export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// format date time
export function formatMessageTime(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 1 hour → minutes
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  // Less than 24 hours → hours
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  // Less than 7 days → days
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  // 7+ days → formatted date dd-mm-yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
