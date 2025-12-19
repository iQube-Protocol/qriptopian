import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allow unauthenticated access for export
export const config = { jwt_secret: undefined };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch all content
    const { data: contentItems, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Transform to requested format
    const transformedItems = (contentItems || []).map((item: any) => {
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

    const exportData = {
      issue: {
        name: "The Qriptopian",
        episode: "Episode 1 - Launch Edition",
        export_date: new Date().toISOString().split('T')[0]
      },
      content_items: transformedItems,
      statistics: {
        total_items: transformedItems.length,
        by_section: {} as Record<string, number>,
        by_status: {} as Record<string, number>,
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

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=qriptopian-episode1-export.json"
      },
    });
  } catch (error: unknown) {
    console.error("Export error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
