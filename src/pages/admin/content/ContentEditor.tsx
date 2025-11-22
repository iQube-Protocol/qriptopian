import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { contentService, type Content, type ContentSection } from '@/services/contentService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ContentEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') as ContentSection;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [readText, setReadText] = useState('');
  const [readDuration, setReadDuration] = useState('');
  const [watchUrl, setWatchUrl] = useState('');
  const [watchDuration, setWatchDuration] = useState('');
  const [listenUrl, setListenUrl] = useState('');
  const [listenDuration, setListenDuration] = useState('');
  const [issueRef, setIssueRef] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadContent();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function loadContent() {
    try {
      const content = await contentService.getContent(id!);
      setTitle(content.title);
      setExcerpt(content.excerpt || '');
      setThumbnail(content.thumbnail || '');
      setIssueRef(content.issue_ref || '');

      const modalities = content.modalities as any || {};
      if (modalities.read) {
        setReadText(modalities.read.text || '');
        setReadDuration(modalities.read.duration || '');
      }
      if (modalities.watch) {
        setWatchUrl(modalities.watch.video_url || '');
        setWatchDuration(modalities.watch.duration || '');
      }
      if (modalities.listen) {
        setListenUrl(modalities.listen.audio_url || '');
        setListenDuration(modalities.listen.duration || '');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File, type: 'thumbnail' | 'video' | 'audio') {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { data, error } = await supabase.storage
        .from('content-media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('content-media')
        .getPublicUrl(filePath);

      if (type === 'thumbnail') {
        setThumbnail(publicUrl);
      } else if (type === 'video') {
        setWatchUrl(publicUrl);
      } else if (type === 'audio') {
        setListenUrl(publicUrl);
      }

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const modalities: any = {};
      if (readText) {
        modalities.read = { text: readText, duration: readDuration };
      }
      if (watchUrl) {
        modalities.watch = { video_url: watchUrl, duration: watchDuration };
      }
      if (listenUrl) {
        modalities.listen = { audio_url: listenUrl, duration: listenDuration };
      }

      const contentData = {
        title,
        excerpt,
        thumbnail,
        modalities,
        placement: { section },
        status: 'published' as const,
        domain: 'qriptopian',
        format: 'article',
        type: 'article',
        content: {},
        issue_ref: issueRef
      } as const;

      if (id && id !== 'new') {
        await contentService.updateContent(id, contentData);
        toast.success('Content updated');
      } else {
        await contentService.createContent(contentData);
        toast.success('Content created');
      }

      navigate(-1);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {id === 'new' ? 'Create Content' : 'Edit Content'}
              </h1>
              <p className="text-muted-foreground">Section: {section}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary or subtitle"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="issueRef">Issue Reference</Label>
                  <Input
                    id="issueRef"
                    value={issueRef}
                    onChange={(e) => setIssueRef(e.target.value)}
                    placeholder="e.g., #0, #1, Issue 1"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      disabled={uploading}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleFileUpload(file, 'thumbnail');
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Content Modalities</h3>
              <Tabs defaultValue="read">
                <TabsList className="w-full">
                  <TabsTrigger value="read" className="flex-1">Read</TabsTrigger>
                  <TabsTrigger value="watch" className="flex-1">Watch</TabsTrigger>
                  <TabsTrigger value="listen" className="flex-1">Listen</TabsTrigger>
                </TabsList>

                <TabsContent value="read" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="readText">Article Content</Label>
                    <Textarea
                      id="readText"
                      value={readText}
                      onChange={(e) => setReadText(e.target.value)}
                      placeholder="Full article text..."
                      rows={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="readDuration">Read Duration</Label>
                    <Input
                      id="readDuration"
                      value={readDuration}
                      onChange={(e) => setReadDuration(e.target.value)}
                      placeholder="e.g., 12 min read"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="watch" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="watchUrl">Video URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="watchUrl"
                        value={watchUrl}
                        onChange={(e) => setWatchUrl(e.target.value)}
                        placeholder="YouTube, Vimeo, or direct video URL"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        disabled={uploading}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'video/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'video');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="watchDuration">Watch Duration</Label>
                    <Input
                      id="watchDuration"
                      value={watchDuration}
                      onChange={(e) => setWatchDuration(e.target.value)}
                      placeholder="e.g., 15:30"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="listen" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="listenUrl">Audio URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="listenUrl"
                        value={listenUrl}
                        onChange={(e) => setListenUrl(e.target.value)}
                        placeholder="Direct audio file URL or podcast link"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        disabled={uploading}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'audio/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(file, 'audio');
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="listenDuration">Listen Duration</Label>
                    <Input
                      id="listenDuration"
                      value={listenDuration}
                      onChange={(e) => setListenDuration(e.target.value)}
                      placeholder="e.g., 10:45"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              {title && <h4 className="font-bold text-lg mb-2">{title}</h4>}
              {excerpt && <p className="text-sm text-muted-foreground mb-4">{excerpt}</p>}
              <div className="flex gap-2">
                {readText && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Read</span>
                )}
                {watchUrl && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Watch</span>
                )}
                {listenUrl && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Listen</span>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
