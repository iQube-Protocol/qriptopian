import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  domain: string;
  format: string;
  type: string;
  placement: any;
  modalities: any;
  thumbnail: string | null;
  tags: string[];
  author_id: string | null;
  author_type: string;
  created_at: string;
  updated_at: string;
}

interface ExportData {
  issue: {
    name: string;
    episode: string;
    export_date: string;
  };
  content_items: any[];
  statistics: {
    total_items: number;
    by_section: Record<string, number>;
    by_status: Record<string, number>;
    by_modality: {
      read: number;
      watch: number;
      listen: number;
      link: number;
    };
  };
}

export default function ExportContent() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data: contentItems, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedItems = (contentItems || []).map((item: ContentItem) => {
        const placement = item.placement || {};
        const modalities = item.modalities || {};
        
        // Build media object
        const media: any = {};
        
        if (item.thumbnail) {
          media.thumbnail = {
            url: item.thumbnail,
            alt_text: item.title
          };
        }
        
        if (modalities.watch?.video_url) {
          const isYouTube = modalities.watch.video_url.includes('youtube.com') || modalities.watch.video_url.includes('youtu.be');
          media.video = {
            url: modalities.watch.video_url,
            type: isYouTube ? 'youtube' : 'hosted'
          };
        }
        
        if (modalities.listen?.audio_url) {
          const isSpotify = modalities.listen.audio_url.includes('spotify.com');
          media.audio = {
            url: modalities.listen.audio_url,
            type: isSpotify ? 'spotify' : 'hosted'
          };
        }

        // Build transformed modalities
        const transformedModalities: any = {};
        
        if (modalities.read) {
          transformedModalities.read = {
            text: modalities.read.text || "",
            duration: modalities.read.duration || ""
          };
        }
        
        if (modalities.watch) {
          const isYouTube = modalities.watch.video_url?.includes('youtube.com') || modalities.watch.video_url?.includes('youtu.be');
          transformedModalities.watch = {
            video_url: modalities.watch.video_url || "",
            duration: modalities.watch.duration || "",
            type: isYouTube ? 'youtube' : 'hosted'
          };
        }
        
        if (modalities.listen) {
          transformedModalities.listen = {
            audio_url: modalities.listen.audio_url || "",
            duration: modalities.listen.duration || ""
          };
        }
        
        if (modalities.link) {
          transformedModalities.link = {
            url: modalities.link.url || "",
            allow_embed: modalities.link.allow_embed || false
          };
        }

        return {
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || "",
          status: item.status || "draft",
          domain: item.domain,
          format: item.format,
          type: item.type,
          placement: {
            section: placement.section || "",
            tab: placement.tab || null,
            position: placement.position || 0,
            imageScale: placement.imageScale || 100,
            imageX: placement.imageX || 50,
            imageY: placement.imageY || 50,
            imagePosition: placement.imagePosition || "center"
          },
          modalities: transformedModalities,
          media: media,
          tags: item.tags || [],
          author_id: item.author_id || null,
          author_type: item.author_type || "agent",
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });

      const exportData: ExportData = {
        issue: {
          name: "The Qriptopian",
          episode: "Episode 1 - Launch Edition",
          export_date: new Date().toISOString().split('T')[0]
        },
        content_items: transformedItems,
        statistics: {
          total_items: transformedItems.length,
          by_section: {},
          by_status: {},
          by_modality: {
            read: 0,
            watch: 0,
            listen: 0,
            link: 0
          }
        }
      };

      // Calculate statistics
      transformedItems.forEach((item: any) => {
        const section = item.placement.section || "unknown";
        const status = item.status;
        
        exportData.statistics.by_section[section] = (exportData.statistics.by_section[section] || 0) + 1;
        exportData.statistics.by_status[status] = (exportData.statistics.by_status[status] || 0) + 1;
        
        if (item.modalities.read) exportData.statistics.by_modality.read++;
        if (item.modalities.watch) exportData.statistics.by_modality.watch++;
        if (item.modalities.listen) exportData.statistics.by_modality.listen++;
        if (item.modalities.link) exportData.statistics.by_modality.link++;
      });

      // Create and download the file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qriptopian-episode1-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Exported ${transformedItems.length} content items`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Export Qriptopian Content</CardTitle>
          <CardDescription>
            Download all content for The Qriptopian Episode 1 (Launch Edition) as a JSON file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>The export includes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All 56 articles across all sections</li>
              <li>Full article text for read modality</li>
              <li>Complete placement metadata (position, imageScale, imageX, imageY)</li>
              <li>All media URLs (Supabase storage and YouTube)</li>
              <li>Author attribution and timestamps</li>
              <li>Content statistics summary</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download JSON Export
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
