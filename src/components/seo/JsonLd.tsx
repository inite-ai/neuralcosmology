import type { ReactElement } from "react";

type JsonLdGraph = Record<string, unknown> | Record<string, unknown>[];

export default function JsonLd({ data, id }: { data: JsonLdGraph; id?: string }): ReactElement {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
