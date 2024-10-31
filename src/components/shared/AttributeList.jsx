export function AttributeList({ data }) {
    return (
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    )
  }