"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import SimpleMdeReact from "react-simplemde-editor";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { updatePoliciesAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function PolicyMarkdownEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const options = useMemo<EasyMDE.Options>(
    () => ({
      spellChecker: false,
      autofocus: false,
      status: ["lines", "words"],
      minHeight: "220px",
      placeholder,
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "heading-2",
        "heading-3",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "table",
        "horizontal-rule",
        "|",
        {
          name: "underline-html",
          className: "fa fa-underline",
          title: "Underline (HTML)",
          action: (editor) => {
            const cm = editor.codemirror;
            const selected = cm.getSelection() || "underlined text";
            cm.replaceSelection(`<u>${selected}</u>`);
            cm.focus();
          },
        },
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: false,
      },
    }),
    [placeholder],
  );

  return (
    <div className="policy-mde modern-editor overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <SimpleMdeReact value={value} onChange={onChange} options={options} />
    </div>
  );
}

export function AdminPoliciesClient({ initial }: { initial: AdminDashboardPayload["policies"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [policies, setPolicies] = useState(initial);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Politikker</h1>
        <p className="text-sm text-muted-foreground">
          Du kan skrive markdown (`#`, `##`, `**fed**`) eller markere tekst og bruge toolbaren.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Aftalebetingelser (offentlig side)</CardTitle>
          <CardDescription>Dette indhold vises pa /aftalebetingelser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="terms-t">Aftalebetingelser</Label>
          <p className="text-xs text-muted-foreground">
            Brug variablerne <code>{"{{pricePerSquareMeter}}"}</code>, <code>{"{{minimumPrice}}"}</code>,{" "}
            <code>{"{{serviceRadiusKm}}"}</code> og <code>{"{{baseLabel}}"}</code> for altid at vise aktuelle settings.
          </p>
          <PolicyMarkdownEditor
            value={policies.termsPolicyText}
            onChange={(next) => setPolicies((p) => ({ ...p, termsPolicyText: next }))}
            placeholder="# Aftalebetingelser\n\nSkriv betingelser her..."
          />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Afbestilling & vilkar</CardTitle>
          <CardDescription>Fx hvordan kunder afbestiller, gebyrer, osv.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="cancel-t">Afbestillingspolitik</Label>
          <PolicyMarkdownEditor
            value={policies.cancellationPolicyText}
            onChange={(next) => setPolicies((p) => ({ ...p, cancellationPolicyText: next }))}
            placeholder="## Afbestilling\n\nSkriv afbestillingspolitik her..."
          />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Privatliv / GDPR-tekst</CardTitle>
          <CardDescription>Kort fortrolighedspolitik eller henvisning til fuld politik.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="priv-t">Privatliv</Label>
          <PolicyMarkdownEditor
            value={policies.privacyPolicyText}
            onChange={(next) => setPolicies((p) => ({ ...p, privacyPolicyText: next }))}
            placeholder="## Privatliv\n\nSkriv privatlivstekst her..."
          />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Ekstra HTML i mail-footer</CardTitle>
          <CardDescription>Valgfrit fragment der tilfojes nederst i skabelon-mails (HTML).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="foot-t">Footer HTML</Label>
          <Textarea
            id="foot-t"
            rows={4}
            value={policies.mailFooterExtraHtml}
            onChange={(e) => setPolicies((p) => ({ ...p, mailFooterExtraHtml: e.target.value }))}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await updatePoliciesAction(policies);
            if (!res.ok) toast.error(res.message ?? "Kunne ikke gemme");
            else {
              toast.success("Politikker gemt");
              router.refresh();
            }
          });
        }}
      >
        Gem politikker
      </Button>
    </div>
  );
}
