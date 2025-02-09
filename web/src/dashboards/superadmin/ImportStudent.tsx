import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ImportStudents() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    // Simulating import process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setImporting(false)
    setImportResult({ success: true, message: 'Successfully imported 100 student records.' })
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Import Students</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <Button onClick={handleImport} disabled={!file || importing}>
              {importing ? 'Importing...' : 'Import Students'}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {importResult && (
            <Alert className="mt-4" variant={importResult.success ? 'default' : 'destructive'}>
              {importResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{importResult.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{importResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </>
  )
}