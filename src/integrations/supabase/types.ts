export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agent_keys: {
        Row: {
          agent_id: string
          agent_name: string
          btc_address: string | null
          btc_private_key_encrypted: string | null
          created_at: string | null
          evm_address: string | null
          evm_private_key_encrypted: string | null
          id: string
          key_version: number | null
          last_used_at: string | null
          persona_id: string | null
          solana_address: string | null
          solana_private_key_encrypted: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          agent_name: string
          btc_address?: string | null
          btc_private_key_encrypted?: string | null
          created_at?: string | null
          evm_address?: string | null
          evm_private_key_encrypted?: string | null
          id?: string
          key_version?: number | null
          last_used_at?: string | null
          persona_id?: string | null
          solana_address?: string | null
          solana_private_key_encrypted?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          agent_name?: string
          btc_address?: string | null
          btc_private_key_encrypted?: string | null
          created_at?: string | null
          evm_address?: string | null
          evm_private_key_encrypted?: string | null
          id?: string
          key_version?: number | null
          last_used_at?: string | null
          persona_id?: string | null
          solana_address?: string | null
          solana_private_key_encrypted?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_keys_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "agent_keys_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_keys_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_keys_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_policies: {
        Row: {
          asset_id: string
          created_at: string | null
          id: string
          pay_to_did: string
          price_amount: number | null
          price_asset: string | null
          rights: string[]
          tokenqube_template: string | null
          visibility: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          id?: string
          pay_to_did: string
          price_amount?: number | null
          price_asset?: string | null
          rights?: string[]
          tokenqube_template?: string | null
          visibility?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          id?: string
          pay_to_did?: string
          price_amount?: number | null
          price_asset?: string | null
          rights?: string[]
          tokenqube_template?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_policies_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_statements: {
        Row: {
          closing_balance: number | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          parsed_at: string
          period_end: string | null
          period_start: string | null
          user_id: string
        }
        Insert: {
          closing_balance?: number | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          parsed_at?: string
          period_end?: string | null
          period_start?: string | null
          user_id: string
        }
        Update: {
          closing_balance?: number | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          parsed_at?: string
          period_end?: string | null
          period_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          agent_id: string
          created_at: string
          franchise_id: string | null
          id: string
          messages: Json
          metadata: Json | null
          persona_id: string | null
          session_id: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string
          created_at?: string
          franchise_id?: string | null
          id?: string
          messages?: Json
          metadata?: Json | null
          persona_id?: string | null
          session_id: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          franchise_id?: string | null
          id?: string
          messages?: Json
          metadata?: Json | null
          persona_id?: string | null
          session_id?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "chat_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          amount_qcent: number
          claimant_did: string
          created_at: string | null
          id: string
          iqube_id: string
          redeem_to: string | null
          rights: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_qcent: number
          claimant_did: string
          created_at?: string | null
          id?: string
          iqube_id: string
          redeem_to?: string | null
          rights?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_qcent?: number
          claimant_did?: string
          created_at?: string | null
          id?: string
          iqube_id?: string
          redeem_to?: string | null
          rights?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cohort_membership: {
        Row: {
          cohort_id: string
          commitment: string
          created_at: string | null
          epoch: number
          risk_tier: number
        }
        Insert: {
          cohort_id: string
          commitment: string
          created_at?: string | null
          epoch: number
          risk_tier: number
        }
        Update: {
          cohort_id?: string
          commitment?: string
          created_at?: string | null
          epoch?: number
          risk_tier?: number
        }
        Relationships: []
      }
      content: {
        Row: {
          ai_metadata: Json | null
          author_id: string | null
          author_type: string | null
          content: Json
          created_at: string | null
          domain: string
          duration: string | null
          event_data: Json | null
          excerpt: string | null
          format: string
          id: string
          issue_ref: string | null
          layout_type: string | null
          logos_sidebar: Json | null
          market_data: Json | null
          modalities: Json | null
          placement: Json | null
          published_at: string | null
          related_content: string[] | null
          slug: string | null
          status: string | null
          tags: string[] | null
          thumbnail: string | null
          title: string
          type: string
          updated_at: string | null
          verification_did: string | null
          verification_proof: Json | null
        }
        Insert: {
          ai_metadata?: Json | null
          author_id?: string | null
          author_type?: string | null
          content?: Json
          created_at?: string | null
          domain: string
          duration?: string | null
          event_data?: Json | null
          excerpt?: string | null
          format: string
          id?: string
          issue_ref?: string | null
          layout_type?: string | null
          logos_sidebar?: Json | null
          market_data?: Json | null
          modalities?: Json | null
          placement?: Json | null
          published_at?: string | null
          related_content?: string[] | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          type: string
          updated_at?: string | null
          verification_did?: string | null
          verification_proof?: Json | null
        }
        Update: {
          ai_metadata?: Json | null
          author_id?: string | null
          author_type?: string | null
          content?: Json
          created_at?: string | null
          domain?: string
          duration?: string | null
          event_data?: Json | null
          excerpt?: string | null
          format?: string
          id?: string
          issue_ref?: string | null
          layout_type?: string | null
          logos_sidebar?: Json | null
          market_data?: Json | null
          modalities?: Json | null
          placement?: Json | null
          published_at?: string | null
          related_content?: string[] | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          verification_did?: string | null
          verification_proof?: Json | null
        }
        Relationships: []
      }
      content_assets: {
        Row: {
          bytes: number | null
          created_at: string | null
          description: string | null
          id: string
          media_kind: string | null
          owner_did: string
          registry_ref: string | null
          sha256: string | null
          status: string | null
          storage_uri: string
          tags: string[] | null
          tenant_id: string
          title: string | null
        }
        Insert: {
          bytes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_kind?: string | null
          owner_did: string
          registry_ref?: string | null
          sha256?: string | null
          status?: string | null
          storage_uri: string
          tags?: string[] | null
          tenant_id: string
          title?: string | null
        }
        Update: {
          bytes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_kind?: string | null
          owner_did?: string
          registry_ref?: string | null
          sha256?: string | null
          status?: string | null
          storage_uri?: string
          tags?: string[] | null
          tenant_id?: string
          title?: string | null
        }
        Relationships: []
      }
      content_entitlements: {
        Row: {
          acquired_at: string
          acquired_via: Database["public"]["Enums"]["entitlement_acquisition"]
          capability_token: string | null
          chain_id: number | null
          content_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_usage: number | null
          persona_id: string
          revoke_reason: string | null
          revoked_at: string | null
          root_did: string | null
          scope: Database["public"]["Enums"]["entitlement_scope"]
          token_qube_id: string | null
          tx_hash: string | null
          usage_count: number
        }
        Insert: {
          acquired_at?: string
          acquired_via: Database["public"]["Enums"]["entitlement_acquisition"]
          capability_token?: string | null
          chain_id?: number | null
          content_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_usage?: number | null
          persona_id: string
          revoke_reason?: string | null
          revoked_at?: string | null
          root_did?: string | null
          scope: Database["public"]["Enums"]["entitlement_scope"]
          token_qube_id?: string | null
          tx_hash?: string | null
          usage_count?: number
        }
        Update: {
          acquired_at?: string
          acquired_via?: Database["public"]["Enums"]["entitlement_acquisition"]
          capability_token?: string | null
          chain_id?: number | null
          content_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_usage?: number | null
          persona_id?: string
          revoke_reason?: string | null
          revoked_at?: string | null
          root_did?: string | null
          scope?: Database["public"]["Enums"]["entitlement_scope"]
          token_qube_id?: string | null
          tx_hash?: string | null
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_entitlements_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "smart_content_qubes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_library: {
        Row: {
          added_at: string
          completed: boolean
          completed_at: string | null
          content_id: string
          custom_shelf_id: string | null
          id: string
          is_favorite: boolean
          last_accessed_at: string | null
          persona_id: string
          position: number
          progress_percentage: number
          root_did: string | null
          shelf_name: string
          time_spent_seconds: number
          updated_at: string
          user_notes: string | null
          user_rating: number | null
        }
        Insert: {
          added_at?: string
          completed?: boolean
          completed_at?: string | null
          content_id: string
          custom_shelf_id?: string | null
          id?: string
          is_favorite?: boolean
          last_accessed_at?: string | null
          persona_id: string
          position?: number
          progress_percentage?: number
          root_did?: string | null
          shelf_name?: string
          time_spent_seconds?: number
          updated_at?: string
          user_notes?: string | null
          user_rating?: number | null
        }
        Update: {
          added_at?: string
          completed?: boolean
          completed_at?: string | null
          content_id?: string
          custom_shelf_id?: string | null
          id?: string
          is_favorite?: boolean
          last_accessed_at?: string | null
          persona_id?: string
          position?: number
          progress_percentage?: number
          root_did?: string | null
          shelf_name?: string
          time_spent_seconds?: number
          updated_at?: string
          user_notes?: string | null
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_library_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "smart_content_qubes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_progress: {
        Row: {
          content_id: string
          id: string
          modality: Database["public"]["Enums"]["content_modality"]
          persona_id: string
          progress_max: number | null
          progress_type: string
          progress_value: number
          recorded_at: string
          session_duration_seconds: number | null
          session_id: string | null
          session_started_at: string | null
        }
        Insert: {
          content_id: string
          id?: string
          modality: Database["public"]["Enums"]["content_modality"]
          persona_id: string
          progress_max?: number | null
          progress_type: string
          progress_value: number
          recorded_at?: string
          session_duration_seconds?: number | null
          session_id?: string | null
          session_started_at?: string | null
        }
        Update: {
          content_id?: string
          id?: string
          modality?: Database["public"]["Enums"]["content_modality"]
          persona_id?: string
          progress_max?: number | null
          progress_type?: string
          progress_value?: number
          recorded_at?: string
          session_duration_seconds?: number | null
          session_id?: string | null
          session_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "smart_content_qubes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          content_id: string | null
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          version: number
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data: Json
          id?: string
          version: number
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_series: {
        Row: {
          app: Database["public"]["Enums"]["smart_content_app"]
          cover_image_uri: string | null
          created_at: string
          creator_root_did: string
          description: string | null
          id: string
          published_count: number
          slug: string
          status: string
          tenant_id: string
          title: string
          total_planned: number | null
          updated_at: string
        }
        Insert: {
          app: Database["public"]["Enums"]["smart_content_app"]
          cover_image_uri?: string | null
          created_at?: string
          creator_root_did: string
          description?: string | null
          id?: string
          published_count?: number
          slug: string
          status?: string
          tenant_id: string
          title: string
          total_planned?: number | null
          updated_at?: string
        }
        Update: {
          app?: Database["public"]["Enums"]["smart_content_app"]
          cover_image_uri?: string | null
          created_at?: string
          creator_root_did?: string
          description?: string | null
          id?: string
          published_count?: number
          slug?: string
          status?: string
          tenant_id?: string
          title?: string
          total_planned?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_admin_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_admin_role_audit: {
        Row: {
          action: string
          admin_role_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          performed_by_admin_role_id: string | null
          performed_by_kybe_did: string | null
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_role_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_by_admin_role_id?: string | null
          performed_by_kybe_did?: string | null
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_role_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_by_admin_role_id?: string | null
          performed_by_kybe_did?: string | null
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_admin_role_audit_admin_role_id_fkey"
            columns: ["admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_role_audit_admin_role_id_fkey"
            columns: ["admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles_expanded"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_role_audit_performed_by_admin_role_id_fkey"
            columns: ["performed_by_admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_role_audit_performed_by_admin_role_id_fkey"
            columns: ["performed_by_admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles_expanded"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_admin_roles: {
        Row: {
          auth_profile_id: string | null
          category_id: string | null
          created_at: string | null
          expires_at: string | null
          franchise_id: string | null
          granted_at: string | null
          granted_by_admin_role_id: string | null
          id: string
          is_active: boolean | null
          kybe_did: string | null
          permissions: Json | null
          platform_account_id: string | null
          role_type: string
          suspended_at: string | null
          suspension_reason: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          auth_profile_id?: string | null
          category_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          franchise_id?: string | null
          granted_at?: string | null
          granted_by_admin_role_id?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did?: string | null
          permissions?: Json | null
          platform_account_id?: string | null
          role_type: string
          suspended_at?: string | null
          suspension_reason?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_profile_id?: string | null
          category_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          franchise_id?: string | null
          granted_at?: string | null
          granted_by_admin_role_id?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did?: string | null
          permissions?: Json | null
          platform_account_id?: string | null
          role_type?: string
          suspended_at?: string | null
          suspension_reason?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_admin_roles_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_granted_by_admin_role_id_fkey"
            columns: ["granted_by_admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_granted_by_admin_role_id_fkey"
            columns: ["granted_by_admin_role_id"]
            isOneToOne: false
            referencedRelation: "crm_admin_roles_expanded"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_admin_roles_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_user_account_layers"
            referencedColumns: ["platform_account_id"]
          },
          {
            foreignKeyName: "crm_admin_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "crm_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_audit_logs: {
        Row: {
          action: string
          change_reason: string | null
          changed_by_agent_id: string | null
          changed_by_auth_profile_id: string | null
          changed_by_persona_id: string | null
          changed_fields: string[] | null
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          tenant_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          change_reason?: string | null
          changed_by_agent_id?: string | null
          changed_by_auth_profile_id?: string | null
          changed_by_persona_id?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          change_reason?: string | null
          changed_by_agent_id?: string | null
          changed_by_auth_profile_id?: string | null
          changed_by_persona_id?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          tenant_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_audit_logs_changed_by_auth_profile_id_fkey"
            columns: ["changed_by_auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_audit_logs_changed_by_persona_id_fkey"
            columns: ["changed_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_audit_logs_changed_by_persona_id_fkey"
            columns: ["changed_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_auth_profile_personas: {
        Row: {
          alias: string | null
          auth_profile_id: string
          created_at: string
          id: string
          is_primary: boolean
          persona_id: string
        }
        Insert: {
          alias?: string | null
          auth_profile_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          persona_id: string
        }
        Update: {
          alias?: string | null
          auth_profile_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          persona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_auth_profile_personas_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_auth_profile_personas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_auth_profile_personas_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_auth_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          email_verified: boolean
          id: string
          is_active: boolean
          kybe_did: string | null
          last_login_at: string | null
          oauth_providers: Json | null
          password_hash: string | null
          root_did_proxy_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          email_verified?: boolean
          id?: string
          is_active?: boolean
          kybe_did?: string | null
          last_login_at?: string | null
          oauth_providers?: Json | null
          password_hash?: string | null
          root_did_proxy_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          is_active?: boolean
          kybe_did?: string | null
          last_login_at?: string | null
          oauth_providers?: Json | null
          password_hash?: string | null
          root_did_proxy_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_category_defaults: {
        Row: {
          category: string
          default_rep_community: number | null
          default_rep_creative: number | null
          default_rep_data_arch: number | null
          default_rep_entrepreneurial: number | null
          default_rep_technical: number | null
          default_reward_ratio_knyt: number | null
          default_reward_ratio_qct: number | null
          default_reward_ratio_qoyn: number | null
          description: string | null
        }
        Insert: {
          category: string
          default_rep_community?: number | null
          default_rep_creative?: number | null
          default_rep_data_arch?: number | null
          default_rep_entrepreneurial?: number | null
          default_rep_technical?: number | null
          default_reward_ratio_knyt?: number | null
          default_reward_ratio_qct?: number | null
          default_reward_ratio_qoyn?: number | null
          description?: string | null
        }
        Update: {
          category?: string
          default_rep_community?: number | null
          default_rep_creative?: number | null
          default_rep_data_arch?: number | null
          default_rep_entrepreneurial?: number | null
          default_rep_technical?: number | null
          default_reward_ratio_knyt?: number | null
          default_reward_ratio_qct?: number | null
          default_reward_ratio_qoyn?: number | null
          description?: string | null
        }
        Relationships: []
      }
      crm_contributions: {
        Row: {
          artifact_metadata: Json | null
          artifact_url: string | null
          base_pokw_weight: number
          clusterqube_id: string | null
          contribution_type: string
          created_at: string
          final_score: number | null
          id: string
          impact_level: number | null
          notes: string | null
          persona_id: string
          pokw_score: number
          pop_score: number | null
          por_score: number | null
          pos_score: number | null
          quality_score: number | null
          qube_id: string | null
          rejection_reason: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by_persona_id: string | null
          scoring_breakdown: Json | null
          source: string | null
          status: string | null
          task_template_id: string | null
          tenant_id: string
          trust_score: number | null
          units: number
        }
        Insert: {
          artifact_metadata?: Json | null
          artifact_url?: string | null
          base_pokw_weight?: number
          clusterqube_id?: string | null
          contribution_type: string
          created_at?: string
          final_score?: number | null
          id?: string
          impact_level?: number | null
          notes?: string | null
          persona_id: string
          pokw_score?: number
          pop_score?: number | null
          por_score?: number | null
          pos_score?: number | null
          quality_score?: number | null
          qube_id?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_persona_id?: string | null
          scoring_breakdown?: Json | null
          source?: string | null
          status?: string | null
          task_template_id?: string | null
          tenant_id: string
          trust_score?: number | null
          units?: number
        }
        Update: {
          artifact_metadata?: Json | null
          artifact_url?: string | null
          base_pokw_weight?: number
          clusterqube_id?: string | null
          contribution_type?: string
          created_at?: string
          final_score?: number | null
          id?: string
          impact_level?: number | null
          notes?: string | null
          persona_id?: string
          pokw_score?: number
          pop_score?: number | null
          por_score?: number | null
          pos_score?: number | null
          quality_score?: number | null
          qube_id?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_persona_id?: string | null
          scoring_breakdown?: Json | null
          source?: string | null
          status?: string | null
          task_template_id?: string | null
          tenant_id?: string
          trust_score?: number | null
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_contributions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contributions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contributions_reviewed_by_persona_id_fkey"
            columns: ["reviewed_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contributions_reviewed_by_persona_id_fkey"
            columns: ["reviewed_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contributions_task_template_id_fkey"
            columns: ["task_template_id"]
            isOneToOne: false
            referencedRelation: "crm_task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_copilot_history: {
        Row: {
          conversation_id: string | null
          created_at: string
          error_message: string | null
          executed_actions: string[] | null
          execution_time_ms: number | null
          extracted_entities: Json | null
          id: string
          parsed_intent: string | null
          persona_id: string | null
          query_text: string
          result_count: number | null
          result_summary: string | null
          session_id: string | null
          success: boolean
          tenant_id: string | null
          tool_calls: Json | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          error_message?: string | null
          executed_actions?: string[] | null
          execution_time_ms?: number | null
          extracted_entities?: Json | null
          id?: string
          parsed_intent?: string | null
          persona_id?: string | null
          query_text: string
          result_count?: number | null
          result_summary?: string | null
          session_id?: string | null
          success?: boolean
          tenant_id?: string | null
          tool_calls?: Json | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          error_message?: string | null
          executed_actions?: string[] | null
          execution_time_ms?: number | null
          extracted_entities?: Json | null
          id?: string
          parsed_intent?: string | null
          persona_id?: string | null
          query_text?: string
          result_count?: number | null
          result_summary?: string | null
          session_id?: string | null
          success?: boolean
          tenant_id?: string | null
          tool_calls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_copilot_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_copilot_history_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_engagement_events: {
        Row: {
          clusterqube_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          persona_id: string
          pokw_delta: number
          qube_id: string | null
          source: string | null
          tenant_id: string
          weight: number
        }
        Insert: {
          clusterqube_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          persona_id: string
          pokw_delta?: number
          qube_id?: string | null
          source?: string | null
          tenant_id: string
          weight?: number
        }
        Update: {
          clusterqube_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          persona_id?: string
          pokw_delta?: number
          qube_id?: string | null
          source?: string | null
          tenant_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_engagement_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_engagement_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_entitlements: {
        Row: {
          access_level: string
          clusterqube_id: string
          created_at: string
          expires_at: string | null
          id: string
          modality: string
          origin: string
          persona_id: string
          qube_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          clusterqube_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          modality: string
          origin?: string
          persona_id: string
          qube_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          clusterqube_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          modality?: string
          origin?: string
          persona_id?: string
          qube_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_entitlements_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_entitlements_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_franchises: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          primary_color: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          primary_color?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_interest_tags: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_tag_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_tag_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_tag_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_interest_tags_parent_tag_id_fkey"
            columns: ["parent_tag_id"]
            isOneToOne: false
            referencedRelation: "crm_interest_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_persona_franchises: {
        Row: {
          created_at: string
          franchise_id: string
          id: string
          joined_at: string
          persona_id: string
          role: string | null
        }
        Insert: {
          created_at?: string
          franchise_id: string
          id?: string
          joined_at?: string
          persona_id: string
          role?: string | null
        }
        Update: {
          created_at?: string
          franchise_id?: string
          id?: string
          joined_at?: string
          persona_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_persona_franchises_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_persona_franchises_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_persona_franchises_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_persona_interests: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          source: string | null
          tag_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          source?: string | null
          tag_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          source?: string | null
          tag_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_persona_interests_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_persona_interests_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_persona_interests_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "crm_interest_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_persona_reputation: {
        Row: {
          lifetime_cvs: number | null
          persona_id: string
          rep_community: number | null
          rep_creative: number | null
          rep_data_arch: number | null
          rep_entrepreneurial: number | null
          rep_overall: number | null
          rep_rolling_12m: number | null
          rep_technical: number | null
          rqh_bucket_id: string | null
          rqh_partition_id: string | null
          rqh_synced_at: string | null
          total_tasks_claimed: number | null
          total_tasks_completed: number | null
          updated_at: string | null
        }
        Insert: {
          lifetime_cvs?: number | null
          persona_id: string
          rep_community?: number | null
          rep_creative?: number | null
          rep_data_arch?: number | null
          rep_entrepreneurial?: number | null
          rep_overall?: number | null
          rep_rolling_12m?: number | null
          rep_technical?: number | null
          rqh_bucket_id?: string | null
          rqh_partition_id?: string | null
          rqh_synced_at?: string | null
          total_tasks_claimed?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
        }
        Update: {
          lifetime_cvs?: number | null
          persona_id?: string
          rep_community?: number | null
          rep_creative?: number | null
          rep_data_arch?: number | null
          rep_entrepreneurial?: number | null
          rep_overall?: number | null
          rep_rolling_12m?: number | null
          rep_technical?: number | null
          rqh_bucket_id?: string | null
          rqh_partition_id?: string | null
          rqh_synced_at?: string | null
          total_tasks_claimed?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_persona_reputation_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_persona_reputation_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_personas: {
        Row: {
          auth_profile_id: string | null
          created_at: string
          display_name: string | null
          email: string | null
          external_user_id: string | null
          id: string
          identity_persona_id: string | null
          kybe_did: string | null
          persona_dataqube_id: string | null
          persona_state: string
          primary_franchise_id: string | null
          primary_wallet_address: string | null
          reputation_bucket: string | null
          reputation_bucket_updated_at: string | null
          reputation_score: number | null
          reputation_updated_at: string | null
          root_did: string | null
          root_did_proxy_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          auth_profile_id?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          external_user_id?: string | null
          id?: string
          identity_persona_id?: string | null
          kybe_did?: string | null
          persona_dataqube_id?: string | null
          persona_state?: string
          primary_franchise_id?: string | null
          primary_wallet_address?: string | null
          reputation_bucket?: string | null
          reputation_bucket_updated_at?: string | null
          reputation_score?: number | null
          reputation_updated_at?: string | null
          root_did?: string | null
          root_did_proxy_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          auth_profile_id?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          external_user_id?: string | null
          id?: string
          identity_persona_id?: string | null
          kybe_did?: string | null
          persona_dataqube_id?: string | null
          persona_state?: string
          primary_franchise_id?: string | null
          primary_wallet_address?: string | null
          reputation_bucket?: string | null
          reputation_bucket_updated_at?: string | null
          reputation_score?: number | null
          reputation_updated_at?: string | null
          root_did?: string | null
          root_did_proxy_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_personas_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_primary_franchise_id_fkey"
            columns: ["primary_franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_platform_accounts: {
        Row: {
          account_type: string
          auth_profile_id: string | null
          avatar_url: string | null
          created_at: string | null
          didqube_consent_at: string | null
          didqube_consent_given: boolean | null
          display_name: string | null
          id: string
          is_active: boolean | null
          kybe_did: string | null
          privacy_level: string | null
          settings: Json | null
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          auth_profile_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          didqube_consent_at?: string | null
          didqube_consent_given?: boolean | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did?: string | null
          privacy_level?: string | null
          settings?: Json | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          auth_profile_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          didqube_consent_at?: string | null
          didqube_consent_given?: boolean | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did?: string | null
          privacy_level?: string | null
          settings?: Json | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_platform_accounts_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_platform_franchise_access: {
        Row: {
          access_role: string
          created_at: string | null
          franchise_id: string
          granted_at: string | null
          granted_by_platform_account_id: string | null
          id: string
          platform_account_id: string
        }
        Insert: {
          access_role?: string
          created_at?: string | null
          franchise_id: string
          granted_at?: string | null
          granted_by_platform_account_id?: string | null
          id?: string
          platform_account_id: string
        }
        Update: {
          access_role?: string
          created_at?: string | null
          franchise_id?: string
          granted_at?: string | null
          granted_by_platform_account_id?: string | null
          id?: string
          platform_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_platform_franchise_access_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_platform_franchise_access_granted_by_platform_account__fkey"
            columns: ["granted_by_platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_platform_franchise_access_granted_by_platform_account__fkey"
            columns: ["granted_by_platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_user_account_layers"
            referencedColumns: ["platform_account_id"]
          },
          {
            foreignKeyName: "crm_platform_franchise_access_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_platform_franchise_access_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_user_account_layers"
            referencedColumns: ["platform_account_id"]
          },
        ]
      }
      crm_registry_persona_links: {
        Row: {
          id: string
          is_primary_for_tenant: boolean | null
          last_synced_at: string | null
          linked_at: string | null
          persona_id: string
          registry_profile_id: string
          reputation_bucket: number | null
          reputation_score: number | null
          tenant_id: string
        }
        Insert: {
          id?: string
          is_primary_for_tenant?: boolean | null
          last_synced_at?: string | null
          linked_at?: string | null
          persona_id: string
          registry_profile_id: string
          reputation_bucket?: number | null
          reputation_score?: number | null
          tenant_id: string
        }
        Update: {
          id?: string
          is_primary_for_tenant?: boolean | null
          last_synced_at?: string | null
          linked_at?: string | null
          persona_id?: string
          registry_profile_id?: string
          reputation_bucket?: number | null
          reputation_score?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_registry_persona_links_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_persona_links_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_persona_links_registry_profile_id_fkey"
            columns: ["registry_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_registry_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_persona_links_registry_profile_id_fkey"
            columns: ["registry_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_registry_profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_persona_links_registry_profile_id_fkey"
            columns: ["registry_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_user_account_layers"
            referencedColumns: ["registry_profile_id"]
          },
          {
            foreignKeyName: "crm_registry_persona_links_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "crm_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_registry_profiles: {
        Row: {
          auth_profile_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_active: boolean | null
          kybe_did: string
          origin_franchise_id: string | null
          origin_layer: string
          origin_tenant_id: string | null
          platform_account_id: string | null
          reputation_bucket: string | null
          reputation_score_cached: number | null
          reputation_updated_at: string | null
          total_contributions_all_tenants: number | null
          total_pokw_all_tenants: number | null
          total_rewards_earned: Json | null
          updated_at: string | null
          visibility_level: string | null
        }
        Insert: {
          auth_profile_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did: string
          origin_franchise_id?: string | null
          origin_layer: string
          origin_tenant_id?: string | null
          platform_account_id?: string | null
          reputation_bucket?: string | null
          reputation_score_cached?: number | null
          reputation_updated_at?: string | null
          total_contributions_all_tenants?: number | null
          total_pokw_all_tenants?: number | null
          total_rewards_earned?: Json | null
          updated_at?: string | null
          visibility_level?: string | null
        }
        Update: {
          auth_profile_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          kybe_did?: string
          origin_franchise_id?: string | null
          origin_layer?: string
          origin_tenant_id?: string | null
          platform_account_id?: string | null
          reputation_bucket?: string | null
          reputation_score_cached?: number | null
          reputation_updated_at?: string | null
          total_contributions_all_tenants?: number | null
          total_pokw_all_tenants?: number | null
          total_rewards_earned?: Json | null
          updated_at?: string | null
          visibility_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_registry_profiles_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_profiles_origin_franchise_id_fkey"
            columns: ["origin_franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_profiles_origin_tenant_id_fkey"
            columns: ["origin_tenant_id"]
            isOneToOne: false
            referencedRelation: "crm_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_profiles_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_platform_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_registry_profiles_platform_account_id_fkey"
            columns: ["platform_account_id"]
            isOneToOne: false
            referencedRelation: "crm_user_account_layers"
            referencedColumns: ["platform_account_id"]
          },
        ]
      }
      crm_reputation_events: {
        Row: {
          cohort_id: string | null
          created_at: string
          created_by_persona_id: string | null
          cvs: number | null
          delta_community: number | null
          delta_creative: number | null
          delta_data_arch: number | null
          delta_entrepreneurial: number | null
          delta_overall: number | null
          delta_technical: number | null
          event_type: string
          final_score_snapshot: number | null
          id: string
          is_anonymized: boolean
          metadata: Json | null
          persona_id: string
          previous_bucket: string | null
          reason: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          reputation_bucket: string | null
          source: string | null
          source_id: string | null
          source_type: string | null
          task_template_id: string | null
          tenant_id: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          created_by_persona_id?: string | null
          cvs?: number | null
          delta_community?: number | null
          delta_creative?: number | null
          delta_data_arch?: number | null
          delta_entrepreneurial?: number | null
          delta_overall?: number | null
          delta_technical?: number | null
          event_type: string
          final_score_snapshot?: number | null
          id?: string
          is_anonymized?: boolean
          metadata?: Json | null
          persona_id: string
          previous_bucket?: string | null
          reason?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          reputation_bucket?: string | null
          source?: string | null
          source_id?: string | null
          source_type?: string | null
          task_template_id?: string | null
          tenant_id: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          created_by_persona_id?: string | null
          cvs?: number | null
          delta_community?: number | null
          delta_creative?: number | null
          delta_data_arch?: number | null
          delta_entrepreneurial?: number | null
          delta_overall?: number | null
          delta_technical?: number | null
          event_type?: string
          final_score_snapshot?: number | null
          id?: string
          is_anonymized?: boolean
          metadata?: Json | null
          persona_id?: string
          previous_bucket?: string | null
          reason?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          reputation_bucket?: string | null
          source?: string | null
          source_id?: string | null
          source_type?: string | null
          task_template_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_reputation_events_created_by_persona_id_fkey"
            columns: ["created_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reputation_events_created_by_persona_id_fkey"
            columns: ["created_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reputation_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reputation_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reputation_events_task_template_id_fkey"
            columns: ["task_template_id"]
            isOneToOne: false
            referencedRelation: "crm_task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_rewards: {
        Row: {
          amount: number
          chain_id: string | null
          contribution_id: string | null
          created_at: string
          id: string
          notes: string | null
          period_end: string
          period_start: string
          persona_id: string
          pillar: string | null
          pokw_score_used: number
          reputation_bucket: number | null
          reputation_multiplier: number | null
          status: string
          task_template_id: string | null
          tenant_id: string
          token_type: string
          tx_hash: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          chain_id?: string | null
          contribution_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          persona_id: string
          pillar?: string | null
          pokw_score_used: number
          reputation_bucket?: number | null
          reputation_multiplier?: number | null
          status?: string
          task_template_id?: string | null
          tenant_id: string
          token_type: string
          tx_hash?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          chain_id?: string | null
          contribution_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          persona_id?: string
          pillar?: string | null
          pokw_score_used?: number
          reputation_bucket?: number | null
          reputation_multiplier?: number | null
          status?: string
          task_template_id?: string | null
          tenant_id?: string
          token_type?: string
          tx_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_rewards_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "crm_contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_rewards_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_rewards_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_rewards_task_template_id_fkey"
            columns: ["task_template_id"]
            isOneToOne: false
            referencedRelation: "crm_task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_segment_members: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          segment_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          segment_id: string
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_segment_members_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_segment_members_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_segment_members_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "crm_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_segments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_dynamic: boolean
          name: string
          rule_definition: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_dynamic?: boolean
          name: string
          rule_definition?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_dynamic?: boolean
          name?: string
          rule_definition?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_task_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by_persona_id: string | null
          current_claims: number | null
          description: string | null
          difficulty_level: number | null
          expected_impact_level: number | null
          expires_at: string | null
          id: string
          impact_enabled: boolean | null
          impact_lookback_days: number | null
          impact_multiplier_max: number | null
          is_active: boolean | null
          is_compute_pillar: boolean | null
          is_knowledge_pillar: boolean | null
          max_claims: number | null
          rep_weight_community: number | null
          rep_weight_creative: number | null
          rep_weight_data_arch: number | null
          rep_weight_entrepreneurial: number | null
          rep_weight_technical: number | null
          reward_knyt: number | null
          reward_qct: number | null
          reward_qoyn: number | null
          slug: string
          tenant_id: string
          title: string
          updated_at: string | null
          verification_config: Json | null
          verification_mode: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by_persona_id?: string | null
          current_claims?: number | null
          description?: string | null
          difficulty_level?: number | null
          expected_impact_level?: number | null
          expires_at?: string | null
          id?: string
          impact_enabled?: boolean | null
          impact_lookback_days?: number | null
          impact_multiplier_max?: number | null
          is_active?: boolean | null
          is_compute_pillar?: boolean | null
          is_knowledge_pillar?: boolean | null
          max_claims?: number | null
          rep_weight_community?: number | null
          rep_weight_creative?: number | null
          rep_weight_data_arch?: number | null
          rep_weight_entrepreneurial?: number | null
          rep_weight_technical?: number | null
          reward_knyt?: number | null
          reward_qct?: number | null
          reward_qoyn?: number | null
          slug: string
          tenant_id: string
          title: string
          updated_at?: string | null
          verification_config?: Json | null
          verification_mode?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by_persona_id?: string | null
          current_claims?: number | null
          description?: string | null
          difficulty_level?: number | null
          expected_impact_level?: number | null
          expires_at?: string | null
          id?: string
          impact_enabled?: boolean | null
          impact_lookback_days?: number | null
          impact_multiplier_max?: number | null
          is_active?: boolean | null
          is_compute_pillar?: boolean | null
          is_knowledge_pillar?: boolean | null
          max_claims?: number | null
          rep_weight_community?: number | null
          rep_weight_creative?: number | null
          rep_weight_data_arch?: number | null
          rep_weight_entrepreneurial?: number | null
          rep_weight_technical?: number | null
          reward_knyt?: number | null
          reward_qct?: number | null
          reward_qoyn?: number | null
          slug?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
          verification_config?: Json | null
          verification_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_task_templates_created_by_persona_id_fkey"
            columns: ["created_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_task_templates_created_by_persona_id_fkey"
            columns: ["created_by_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tenants: {
        Row: {
          config: Json | null
          created_at: string
          default_modalities: string[] | null
          description: string | null
          domain: string | null
          franchise_id: string
          id: string
          is_active: boolean
          name: string
          slug: string
          supported_tokens: string[] | null
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          default_modalities?: string[] | null
          description?: string | null
          domain?: string | null
          franchise_id: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          supported_tokens?: string[] | null
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          default_modalities?: string[] | null
          description?: string | null
          domain?: string | null
          franchise_id?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          supported_tokens?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tenants_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_wallet_events: {
        Row: {
          amount: number | null
          block_number: number | null
          chain_id: string
          counterparty_address: string | null
          counterparty_persona_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          nft_metadata: Json | null
          nft_token_id: string | null
          persona_id: string
          source: string | null
          status: string
          tenant_id: string
          token_address: string | null
          token_type: string | null
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          amount?: number | null
          block_number?: number | null
          chain_id: string
          counterparty_address?: string | null
          counterparty_persona_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          nft_metadata?: Json | null
          nft_token_id?: string | null
          persona_id: string
          source?: string | null
          status?: string
          tenant_id: string
          token_address?: string | null
          token_type?: string | null
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          amount?: number | null
          block_number?: number | null
          chain_id?: string
          counterparty_address?: string | null
          counterparty_persona_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          nft_metadata?: Json | null
          nft_token_id?: string | null
          persona_id?: string
          source?: string | null
          status?: string
          tenant_id?: string
          token_address?: string | null
          token_type?: string | null
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_wallet_events_counterparty_persona_id_fkey"
            columns: ["counterparty_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_wallet_events_counterparty_persona_id_fkey"
            columns: ["counterparty_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_wallet_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_wallet_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      custody_events: {
        Row: {
          created_at: string | null
          from_did: string
          id: string
          iqube_id: string
          meta: Json | null
          rights: string[] | null
          to_did: string
        }
        Insert: {
          created_at?: string | null
          from_did: string
          id?: string
          iqube_id: string
          meta?: Json | null
          rights?: string[] | null
          to_did: string
        }
        Update: {
          created_at?: string | null
          from_did?: string
          id?: string
          iqube_id?: string
          meta?: Json | null
          rights?: string[] | null
          to_did?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          blak_uri: string | null
          created_at: string
          hashes: Json | null
          id: string
          message_id: string | null
          meta_cid: string | null
          pod_proof: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          blak_uri?: string | null
          created_at?: string
          hashes?: Json | null
          id?: string
          message_id?: string | null
          meta_cid?: string | null
          pod_proof?: Json | null
          status?: string
          user_id?: string | null
        }
        Update: {
          blak_uri?: string | null
          created_at?: string
          hashes?: Json | null
          id?: string
          message_id?: string | null
          meta_cid?: string | null
          pod_proof?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "x402_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      did_binding: {
        Row: {
          alias_commitment: string
          cohort_id: string | null
          created_at: string | null
          escrow_expiry: string | null
          id: string
          persona_id: string | null
          state_type: string | null
        }
        Insert: {
          alias_commitment: string
          cohort_id?: string | null
          created_at?: string | null
          escrow_expiry?: string | null
          id?: string
          persona_id?: string | null
          state_type?: string | null
        }
        Update: {
          alias_commitment?: string
          cohort_id?: string | null
          created_at?: string | null
          escrow_expiry?: string | null
          id?: string
          persona_id?: string | null
          state_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "did_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "did_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      did_identities: {
        Row: {
          agent_handle: string | null
          created_at: string | null
          did: string
          id: string
          kybe_did: string | null
        }
        Insert: {
          agent_handle?: string | null
          created_at?: string | null
          did: string
          id?: string
          kybe_did?: string | null
        }
        Update: {
          agent_handle?: string | null
          created_at?: string | null
          did?: string
          id?: string
          kybe_did?: string | null
        }
        Relationships: []
      }
      dvn_attestations: {
        Row: {
          created_at: string | null
          dvn_root: string
          id: string
          message_id: string
          proof: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dvn_root: string
          id?: string
          message_id: string
          proof?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dvn_root?: string
          id?: string
          message_id?: string
          proof?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      entitlements: {
        Row: {
          asset_id: string
          created_at: string | null
          expires_at: string | null
          holder_did: string
          id: string
          rights: string[]
          tokenqube_id: string | null
          x402_id: string
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          expires_at?: string | null
          holder_did: string
          id?: string
          rights: string[]
          tokenqube_id?: string | null
          x402_id: string
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          expires_at?: string | null
          holder_did?: string
          id?: string
          rights?: string[]
          tokenqube_id?: string | null
          x402_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_x402_id_fkey"
            columns: ["x402_id"]
            isOneToOne: false
            referencedRelation: "x402_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          event_type: string
          id: string
          persona_id: string | null
          severity: string
          tenant_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          persona_id?: string | null
          severity?: string
          tenant_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          persona_id?: string | null
          severity?: string
          tenant_id?: string
        }
        Relationships: []
      }
      executions: {
        Row: {
          avg_price: number
          capture_bps: number | null
          chain: string
          execution_venue: string | null
          id: string
          intent_id: string | null
          metadata: Json | null
          qty_filled: number
          side: string
          timestamp: string
          user_id: string
        }
        Insert: {
          avg_price: number
          capture_bps?: number | null
          chain: string
          execution_venue?: string | null
          id?: string
          intent_id?: string | null
          metadata?: Json | null
          qty_filled: number
          side: string
          timestamp?: string
          user_id: string
        }
        Update: {
          avg_price?: number
          capture_bps?: number | null
          chain?: string
          execution_venue?: string | null
          id?: string
          intent_id?: string | null
          metadata?: Json | null
          qty_filled?: number
          side?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "executions_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "trading_intents"
            referencedColumns: ["intent_id"]
          },
        ]
      }
      financial_aggregates: {
        Row: {
          avg_daily_surplus: number | null
          cash_buffer_days: number | null
          closing_balance: number | null
          computed_at: string
          confidence_score: number | null
          created_at: string
          id: string
          surplus_volatility: number | null
          top_categories: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_daily_surplus?: number | null
          cash_buffer_days?: number | null
          closing_balance?: number | null
          computed_at?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          surplus_volatility?: number | null
          top_categories?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_daily_surplus?: number | null
          cash_buffer_days?: number | null
          closing_balance?: number | null
          computed_at?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          surplus_volatility?: number | null
          top_categories?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fio_cache: {
        Row: {
          expires_at: string | null
          handle: string
          owner_pubkey: string | null
          raw_response: Json | null
        }
        Insert: {
          expires_at?: string | null
          handle: string
          owner_pubkey?: string | null
          raw_response?: Json | null
        }
        Update: {
          expires_at?: string | null
          handle?: string
          owner_pubkey?: string | null
          raw_response?: Json | null
        }
        Relationships: []
      }
      franchise_admins: {
        Row: {
          created_at: string
          franchise_id: string
          id: string
          persona_id: string
          role: string
        }
        Insert: {
          created_at?: string
          franchise_id: string
          id?: string
          persona_id: string
          role: string
        }
        Update: {
          created_at?: string
          franchise_id?: string
          id?: string
          persona_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_admins_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "franchise_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "franchise_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_config: {
        Row: {
          created_at: string
          franchise_id: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          franchise_id: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          franchise_id?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_config_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          active: boolean
          chains: string[] | null
          created_at: string
          description: string | null
          id: string
          kb_endpoint: string | null
          name: string
          slug: string
          ui_url: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          chains?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          kb_endpoint?: string | null
          name: string
          slug: string
          ui_url?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          chains?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          kb_endpoint?: string | null
          name?: string
          slug?: string
          ui_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hcp_profile: {
        Row: {
          persona_id: string
          preference_ptr: string | null
          revocation: Json | null
          scopes: Json | null
          updated_at: string | null
        }
        Insert: {
          persona_id: string
          preference_ptr?: string | null
          revocation?: Json | null
          scopes?: Json | null
          updated_at?: string | null
        }
        Update: {
          persona_id?: string
          preference_ptr?: string | null
          revocation?: Json | null
          scopes?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hcp_profile_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "hcp_profile_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hcp_profile_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hcp_profile_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_aliases: {
        Row: {
          alias_type: string
          alias_value: string
          entity_did: string
          expires_at: string | null
          id: string
          last_verified_at: string | null
          proof_ref: string | null
          updated_at: string
          user_id: string | null
          verified: boolean
        }
        Insert: {
          alias_type: string
          alias_value: string
          entity_did: string
          expires_at?: string | null
          id?: string
          last_verified_at?: string | null
          proof_ref?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          alias_type?: string
          alias_value?: string
          entity_did?: string
          expires_at?: string | null
          id?: string
          last_verified_at?: string | null
          proof_ref?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      iqube_capabilities: {
        Row: {
          acl_delta_sig: string | null
          audience_alias: Json | null
          audience_did: string
          created_at: string
          id: string
          iqube_ref: string
          scope: Json
          state: string
          ttl: string | null
          user_id: string | null
        }
        Insert: {
          acl_delta_sig?: string | null
          audience_alias?: Json | null
          audience_did: string
          created_at?: string
          id?: string
          iqube_ref: string
          scope: Json
          state?: string
          ttl?: string | null
          user_id?: string | null
        }
        Update: {
          acl_delta_sig?: string | null
          audience_alias?: Json | null
          audience_did?: string
          created_at?: string
          id?: string
          iqube_ref?: string
          scope?: Json
          state?: string
          ttl?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      iqube_events: {
        Row: {
          created_at: string
          id: string
          identity_snapshot: Json | null
          iqube_ref: string
          state_proof: Json | null
          type: string
          user_id: string | null
          x402_message_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          identity_snapshot?: Json | null
          iqube_ref: string
          state_proof?: Json | null
          type: string
          user_id?: string | null
          x402_message_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          identity_snapshot?: Json | null
          iqube_ref?: string
          state_proof?: Json | null
          type?: string
          user_id?: string | null
          x402_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iqube_events_x402_message_id_fkey"
            columns: ["x402_message_id"]
            isOneToOne: false
            referencedRelation: "x402_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      iqube_shares: {
        Row: {
          access_level: string
          consent_given_at: string
          created_at: string
          id: string
          iqube_id: string
          owner_persona_id: string | null
          revoked_at: string | null
          shared_with_persona_id: string | null
          shared_with_tenant_id: string | null
        }
        Insert: {
          access_level: string
          consent_given_at?: string
          created_at?: string
          id?: string
          iqube_id: string
          owner_persona_id?: string | null
          revoked_at?: string | null
          shared_with_persona_id?: string | null
          shared_with_tenant_id?: string | null
        }
        Update: {
          access_level?: string
          consent_given_at?: string
          created_at?: string
          id?: string
          iqube_id?: string
          owner_persona_id?: string | null
          revoked_at?: string | null
          shared_with_persona_id?: string | null
          shared_with_tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iqube_shares_owner_persona_id_fkey"
            columns: ["owner_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "iqube_shares_owner_persona_id_fkey"
            columns: ["owner_persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_owner_persona_id_fkey"
            columns: ["owner_persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_owner_persona_id_fkey"
            columns: ["owner_persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_shared_with_persona_id_fkey"
            columns: ["shared_with_persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "iqube_shares_shared_with_persona_id_fkey"
            columns: ["shared_with_persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_shared_with_persona_id_fkey"
            columns: ["shared_with_persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_shared_with_persona_id_fkey"
            columns: ["shared_with_persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_shares_shared_with_tenant_id_fkey"
            columns: ["shared_with_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      iqube_templates: {
        Row: {
          accuracy_score: number
          blakqube_labels: string[] | null
          business_model: string | null
          created_at: string
          description: string
          id: string
          instance_type: string | null
          iqube_type: string | null
          metaqube_extras: Json | null
          name: string
          owner: string | null
          parent_template_id: string | null
          price: number | null
          provenance: number | null
          public_read: boolean
          risk_score: number
          sensitivity_score: number | null
          tenant_id: string | null
          updated_at: string
          user_id: string | null
          verifiability_score: number
          version: number | null
          visibility: string | null
        }
        Insert: {
          accuracy_score: number
          blakqube_labels?: string[] | null
          business_model?: string | null
          created_at?: string
          description?: string
          id?: string
          instance_type?: string | null
          iqube_type?: string | null
          metaqube_extras?: Json | null
          name: string
          owner?: string | null
          parent_template_id?: string | null
          price?: number | null
          provenance?: number | null
          public_read?: boolean
          risk_score: number
          sensitivity_score?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string | null
          verifiability_score: number
          version?: number | null
          visibility?: string | null
        }
        Update: {
          accuracy_score?: number
          blakqube_labels?: string[] | null
          business_model?: string | null
          created_at?: string
          description?: string
          id?: string
          instance_type?: string | null
          iqube_type?: string | null
          metaqube_extras?: Json | null
          name?: string
          owner?: string | null
          parent_template_id?: string | null
          price?: number | null
          provenance?: number | null
          public_read?: boolean
          risk_score?: number
          sensitivity_score?: number | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string | null
          verifiability_score?: number
          version?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iqube_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "iqube_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iqube_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          doc_type: string | null
          embedding: string | null
          id: string
          is_root: boolean | null
          metadata: Json | null
          source: string | null
          tags: string[] | null
          tenant_id: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          doc_type?: string | null
          embedding?: string | null
          id?: string
          is_root?: boolean | null
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          doc_type?: string | null
          embedding?: string | null
          id?: string
          is_root?: boolean | null
          metadata?: Json | null
          source?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      kybe_identity: {
        Row: {
          encrypted_soul_key: string | null
          id: string
          issued_at: string | null
          kybe_did: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          encrypted_soul_key?: string | null
          id?: string
          issued_at?: string | null
          kybe_did: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          encrypted_soul_key?: string | null
          id?: string
          issued_at?: string | null
          kybe_did?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mailbox: {
        Row: {
          created_at: string | null
          last_pull: string | null
          mailbox_id: string
          relay_hint: string | null
        }
        Insert: {
          created_at?: string | null
          last_pull?: string | null
          mailbox_id: string
          relay_hint?: string | null
        }
        Update: {
          created_at?: string | null
          last_pull?: string | null
          mailbox_id?: string
          relay_hint?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          asset_type: string
          created_at: string
          creator_root_did: string | null
          deleted_at: string | null
          duration_seconds: number | null
          file_name: string | null
          height: number | null
          id: string
          mime_type: string
          size_bytes: number | null
          storage_bucket: string | null
          storage_provider: Database["public"]["Enums"]["storage_provider"]
          storage_uri: string
          tenant_id: string
          thumbnail_storage_provider:
            | Database["public"]["Enums"]["storage_provider"]
            | null
          thumbnail_uri: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          asset_type: string
          created_at?: string
          creator_root_did?: string | null
          deleted_at?: string | null
          duration_seconds?: number | null
          file_name?: string | null
          height?: number | null
          id?: string
          mime_type: string
          size_bytes?: number | null
          storage_bucket?: string | null
          storage_provider?: Database["public"]["Enums"]["storage_provider"]
          storage_uri: string
          tenant_id: string
          thumbnail_storage_provider?:
            | Database["public"]["Enums"]["storage_provider"]
            | null
          thumbnail_uri?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string
          created_at?: string
          creator_root_did?: string | null
          deleted_at?: string | null
          duration_seconds?: number | null
          file_name?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          size_bytes?: number | null
          storage_bucket?: string | null
          storage_provider?: Database["public"]["Enums"]["storage_provider"]
          storage_uri?: string
          tenant_id?: string
          thumbnail_storage_provider?:
            | Database["public"]["Enums"]["storage_provider"]
            | null
          thumbnail_uri?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      persona: {
        Row: {
          app_origin: string | null
          created_at: string | null
          default_identity_state: string
          fio_handle: string | null
          fio_handle_expiration: string | null
          fio_handle_verified: boolean | null
          fio_last_verified_at: string | null
          fio_public_key: string | null
          fio_registered_at: string | null
          fio_registration_status: string | null
          fio_tx_id: string | null
          franchise_id: string | null
          id: string
          root_id: string | null
          tenant_id: string | null
          world_id_status: string | null
        }
        Insert: {
          app_origin?: string | null
          created_at?: string | null
          default_identity_state?: string
          fio_handle?: string | null
          fio_handle_expiration?: string | null
          fio_handle_verified?: boolean | null
          fio_last_verified_at?: string | null
          fio_public_key?: string | null
          fio_registered_at?: string | null
          fio_registration_status?: string | null
          fio_tx_id?: string | null
          franchise_id?: string | null
          id?: string
          root_id?: string | null
          tenant_id?: string | null
          world_id_status?: string | null
        }
        Update: {
          app_origin?: string | null
          created_at?: string | null
          default_identity_state?: string
          fio_handle?: string | null
          fio_handle_expiration?: string | null
          fio_handle_verified?: boolean | null
          fio_last_verified_at?: string | null
          fio_public_key?: string | null
          fio_registered_at?: string | null
          fio_registration_status?: string | null
          fio_tx_id?: string | null
          franchise_id?: string | null
          id?: string
          root_id?: string | null
          tenant_id?: string | null
          world_id_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_root_id_fkey"
            columns: ["root_id"]
            isOneToOne: false
            referencedRelation: "root_identity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_agent_binding: {
        Row: {
          agent_id: string
          created_at: string | null
          is_primary: boolean | null
          persona_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          is_primary?: boolean | null
          persona_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          is_primary?: boolean | null
          persona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "persona_agent_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "persona_agent_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_agent_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "persona_agent_binding_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          auth_profile_id: string | null
          avatar_uri: string | null
          badges: string[]
          chain_addresses: Json
          created_at: string
          display_name: string
          evm_key: Json
          fio_domain: string
          fio_handle: string
          fio_registration: Json | null
          id: string
          reputation_bucket: number
          reputation_score: number
          root_did: string
          status: string
          tenant_id: string
          type: string
          updated_at: string
        }
        Insert: {
          auth_profile_id?: string | null
          avatar_uri?: string | null
          badges?: string[]
          chain_addresses?: Json
          created_at?: string
          display_name: string
          evm_key: Json
          fio_domain: string
          fio_handle: string
          fio_registration?: Json | null
          id?: string
          reputation_bucket?: number
          reputation_score?: number
          root_did: string
          status?: string
          tenant_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          auth_profile_id?: string | null
          avatar_uri?: string | null
          badges?: string[]
          chain_addresses?: Json
          created_at?: string
          display_name?: string
          evm_key?: Json
          fio_domain?: string
          fio_handle?: string
          fio_registration?: Json | null
          id?: string
          reputation_bucket?: number
          reputation_score?: number
          root_did?: string
          status?: string
          tenant_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          persona_id: string | null
          trading_preferences: Json | null
          updated_at: string | null
          wallet_addresses: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          persona_id?: string | null
          trading_preferences?: Json | null
          updated_at?: string | null
          wallet_addresses?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          persona_id?: string | null
          trading_preferences?: Json | null
          updated_at?: string | null
          wallet_addresses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "profiles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          ask: number | null
          bid: number | null
          extra: Json | null
          id: string
          mid: number | null
          source: string | null
          symbol: string
          tenant_id: string
          ts: string
        }
        Insert: {
          ask?: number | null
          bid?: number | null
          extra?: Json | null
          id?: string
          mid?: number | null
          source?: string | null
          symbol: string
          tenant_id: string
          ts?: string
        }
        Update: {
          ask?: number | null
          bid?: number | null
          extra?: Json | null
          id?: string
          mid?: number | null
          source?: string | null
          symbol?: string
          tenant_id?: string
          ts?: string
        }
        Relationships: []
      }
      recommendation_history: {
        Row: {
          confidence_score: number | null
          created_at: string
          daily_loss_limit_bps: number | null
          id: string
          inventory_max: number | null
          inventory_min: number | null
          max_notional_usd: number | null
          min_edge_bps: number | null
          reasoning: string | null
          recommendation_id: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          daily_loss_limit_bps?: number | null
          id?: string
          inventory_max?: number | null
          inventory_min?: number | null
          max_notional_usd?: number | null
          min_edge_bps?: number | null
          reasoning?: string | null
          recommendation_id?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          daily_loss_limit_bps?: number | null
          id?: string
          inventory_max?: number | null
          inventory_min?: number | null
          max_notional_usd?: number | null
          min_edge_bps?: number | null
          reasoning?: string | null
          recommendation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_history_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "trading_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_qubes: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          direction: string
          id: string
          metadata: Json
          relationship_data: Json
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          source_id: string
          source_type: Database["public"]["Enums"]["relationship_entity_type"]
          status: string
          target_id: string
          target_type: Database["public"]["Enums"]["relationship_entity_type"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          direction?: string
          id?: string
          metadata?: Json
          relationship_data: Json
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          source_id: string
          source_type: Database["public"]["Enums"]["relationship_entity_type"]
          status?: string
          target_id: string
          target_type: Database["public"]["Enums"]["relationship_entity_type"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          direction?: string
          id?: string
          metadata?: Json
          relationship_data?: Json
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          source_id?: string
          source_type?: Database["public"]["Enums"]["relationship_entity_type"]
          status?: string
          target_id?: string
          target_type?: Database["public"]["Enums"]["relationship_entity_type"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reputation_bucket: {
        Row: {
          bucket_level: number | null
          created_at: string | null
          evidence_count: number | null
          id: string
          last_synced_at: string | null
          partition_id: string
          persona_id: string | null
          rqh_bucket_id: string | null
          score: number | null
          skill_category: string
          updated_at: string | null
        }
        Insert: {
          bucket_level?: number | null
          created_at?: string | null
          evidence_count?: number | null
          id?: string
          last_synced_at?: string | null
          partition_id: string
          persona_id?: string | null
          rqh_bucket_id?: string | null
          score?: number | null
          skill_category: string
          updated_at?: string | null
        }
        Update: {
          bucket_level?: number | null
          created_at?: string | null
          evidence_count?: number | null
          id?: string
          last_synced_at?: string | null
          partition_id?: string
          persona_id?: string | null
          rqh_bucket_id?: string | null
          score?: number | null
          skill_category?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_bucket_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "reputation_bucket_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_bucket_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_bucket_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_evidence: {
        Row: {
          created_at: string | null
          evidence_data: Json | null
          evidence_type: string
          id: string
          reputation_bucket_id: string | null
          rqh_evidence_id: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          evidence_data?: Json | null
          evidence_type: string
          id?: string
          reputation_bucket_id?: string | null
          rqh_evidence_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          evidence_data?: Json | null
          evidence_type?: string
          id?: string
          reputation_bucket_id?: string | null
          rqh_evidence_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reputation_evidence_reputation_bucket_id_fkey"
            columns: ["reputation_bucket_id"]
            isOneToOne: false
            referencedRelation: "reputation_bucket"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      root_identity: {
        Row: {
          created_at: string | null
          did_uri: string
          id: string
          kybe_hash: string | null
          kybe_id: string | null
          kyc_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          did_uri: string
          id?: string
          kybe_hash?: string | null
          kybe_id?: string | null
          kyc_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          did_uri?: string
          id?: string
          kybe_hash?: string | null
          kybe_id?: string | null
          kyc_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "root_identity_kybe_id_fkey"
            columns: ["kybe_id"]
            isOneToOne: false
            referencedRelation: "kybe_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      root_prompts: {
        Row: {
          applicable_to: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          prompt_content: string
          prompt_name: string
          updated_at: string | null
          version: string
        }
        Insert: {
          applicable_to?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prompt_content: string
          prompt_name: string
          updated_at?: string | null
          version: string
        }
        Update: {
          applicable_to?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prompt_content?: string
          prompt_name?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_content_qubes: {
        Row: {
          access_policy: Json
          app: Database["public"]["Enums"]["smart_content_app"]
          content_qube_id: string | null
          cover_image_uri: string | null
          created_at: string
          creator_root_did: string
          deleted_at: string | null
          description: string | null
          id: string
          identity_requirements: Json
          layout_hints: Json
          library_metadata: Json
          menu_integration: Json
          meta_qube_cid: string | null
          modalities: Json
          pricing_model: Json
          published_at: string | null
          reputation_requirements: Json
          reward_outcomes: Json
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          structure_data: Json | null
          structure_kind:
            | Database["public"]["Enums"]["content_structure_kind"]
            | null
          tenant_id: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          access_policy?: Json
          app: Database["public"]["Enums"]["smart_content_app"]
          content_qube_id?: string | null
          cover_image_uri?: string | null
          created_at?: string
          creator_root_did: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          identity_requirements?: Json
          layout_hints?: Json
          library_metadata?: Json
          menu_integration?: Json
          meta_qube_cid?: string | null
          modalities?: Json
          pricing_model?: Json
          published_at?: string | null
          reputation_requirements?: Json
          reward_outcomes?: Json
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          structure_data?: Json | null
          structure_kind?:
            | Database["public"]["Enums"]["content_structure_kind"]
            | null
          tenant_id: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          access_policy?: Json
          app?: Database["public"]["Enums"]["smart_content_app"]
          content_qube_id?: string | null
          cover_image_uri?: string | null
          created_at?: string
          creator_root_did?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          identity_requirements?: Json
          layout_hints?: Json
          library_metadata?: Json
          menu_integration?: Json
          meta_qube_cid?: string | null
          modalities?: Json
          pricing_model?: Json
          published_at?: string | null
          reputation_requirements?: Json
          reward_outcomes?: Json
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          structure_data?: Json | null
          structure_kind?:
            | Database["public"]["Enums"]["content_structure_kind"]
            | null
          tenant_id?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string | null
          entries_synced: number | null
          error_message: string | null
          id: string
          status: string
          sync_type: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          entries_synced?: number | null
          error_message?: string | null
          id?: string
          status: string
          sync_type: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          entries_synced?: number | null
          error_message?: string | null
          id?: string
          status?: string
          sync_type?: string
          tenant_id?: string
        }
        Relationships: []
      }
      tenant_admins: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          role: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          role: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          role?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "tenant_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_admins_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_admins_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: number
          is_active: boolean
          label: string | null
          tenant_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: number
          is_active?: boolean
          label?: string | null
          tenant_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: number
          is_active?: boolean
          label?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          active: boolean
          agent_name: string | null
          chains: string[] | null
          created_at: string
          display_name: string | null
          franchise_id: string | null
          id: string
          kb_endpoint: string | null
          metadata: Json | null
          name: string
          parent_project: string | null
          slug: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          agent_name?: string | null
          chains?: string[] | null
          created_at?: string
          display_name?: string | null
          franchise_id?: string | null
          id?: string
          kb_endpoint?: string | null
          metadata?: Json | null
          name: string
          parent_project?: string | null
          slug?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          agent_name?: string | null
          chains?: string[] | null
          created_at?: string
          display_name?: string | null
          franchise_id?: string | null
          id?: string
          kb_endpoint?: string | null
          metadata?: Json | null
          name?: string
          parent_project?: string | null
          slug?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_intents: {
        Row: {
          amount_qc: number
          avg_price: number | null
          cancelled_at: string | null
          capture_bps: number | null
          chain: string
          created_at: string
          filled_at: string | null
          id: string
          intent_id: string
          limit_price: number | null
          max_slippage_bps: number
          metadata: Json | null
          min_edge_bps: number
          order_type: string
          qty_filled: number | null
          side: string
          status: string
          stop_loss: number | null
          take_profit: number | null
          time_in_force: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_qc: number
          avg_price?: number | null
          cancelled_at?: string | null
          capture_bps?: number | null
          chain: string
          created_at?: string
          filled_at?: string | null
          id?: string
          intent_id?: string
          limit_price?: number | null
          max_slippage_bps: number
          metadata?: Json | null
          min_edge_bps: number
          order_type?: string
          qty_filled?: number | null
          side: string
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          time_in_force?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_qc?: number
          avg_price?: number | null
          cancelled_at?: string | null
          capture_bps?: number | null
          chain?: string
          created_at?: string
          filled_at?: string | null
          id?: string
          intent_id?: string
          limit_price?: number | null
          max_slippage_bps?: number
          metadata?: Json | null
          min_edge_bps?: number
          order_type?: string
          qty_filled?: number | null
          side?: string
          status?: string
          stop_loss?: number | null
          take_profit?: number | null
          time_in_force?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_recommendations: {
        Row: {
          created_at: string
          daily_loss_limit_bps: number | null
          id: string
          inventory_max: number | null
          inventory_min: number | null
          max_notional_usd: number | null
          min_edge_bps: number | null
          reasoning: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_loss_limit_bps?: number | null
          id?: string
          inventory_max?: number | null
          inventory_min?: number | null
          max_notional_usd?: number | null
          min_edge_bps?: number | null
          reasoning?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_loss_limit_bps?: number | null
          id?: string
          inventory_max?: number | null
          inventory_min?: number | null
          max_notional_usd?: number | null
          min_edge_bps?: number | null
          reasoning?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_did_mapping: {
        Row: {
          created_at: string | null
          did: string
          id: string
          persona_id: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          did: string
          id?: string
          persona_id?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          did?: string
          id?: string
          persona_id?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_did_mapping_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "user_did_mapping_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_did_mapping_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_did_mapping_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library: {
        Row: {
          added_at: string
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "iqube_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_shelves: {
        Row: {
          cover_image_uri: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          persona_id: string
          position: number
          updated_at: string
        }
        Insert: {
          cover_image_uri?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          persona_id: string
          position?: number
          updated_at?: string
        }
        Update: {
          cover_image_uri?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          persona_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      x402_messages: {
        Row: {
          bridge_message_id: string | null
          created_at: string
          headers: Json
          id: string
          identity_proofs: Json | null
          intent: string
          payload: Json
          proofs: Json | null
          resolved_recipient_did: string | null
          resolved_sender_did: string | null
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bridge_message_id?: string | null
          created_at?: string
          headers: Json
          id?: string
          identity_proofs?: Json | null
          intent: string
          payload: Json
          proofs?: Json | null
          resolved_recipient_did?: string | null
          resolved_sender_did?: string | null
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bridge_message_id?: string | null
          created_at?: string
          headers?: Json
          id?: string
          identity_proofs?: Json | null
          intent?: string
          payload?: Json
          proofs?: Json | null
          resolved_recipient_did?: string | null
          resolved_sender_did?: string | null
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      x402_settlements: {
        Row: {
          amount: string
          asset: string
          created_at: string
          escrow_tx: string | null
          id: string
          message_id: string | null
          release_tx: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount: string
          asset: string
          created_at?: string
          escrow_tx?: string | null
          id?: string
          message_id?: string | null
          release_tx?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: string
          asset?: string
          created_at?: string
          escrow_tx?: string | null
          id?: string
          message_id?: string | null
          release_tx?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "x402_settlements_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "x402_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      x402_transactions: {
        Row: {
          amount: number
          asset_id: string
          asset_symbol: string
          buyer_did: string
          created_at: string | null
          dest_chain: string | null
          facilitator_ref: string | null
          id: string
          request_id: string
          seller_did: string
          src_chain: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          amount: number
          asset_id: string
          asset_symbol: string
          buyer_did: string
          created_at?: string | null
          dest_chain?: string | null
          facilitator_ref?: string | null
          id?: string
          request_id: string
          seller_did: string
          src_chain?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          amount?: number
          asset_id?: string
          asset_symbol?: string
          buyer_did?: string
          created_at?: string | null
          dest_chain?: string | null
          facilitator_ref?: string | null
          id?: string
          request_id?: string
          seller_did?: string
          src_chain?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "x402_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      crm_admin_roles_expanded: {
        Row: {
          access_level: number | null
          admin_display_name: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          expires_at: string | null
          franchise_name: string | null
          franchise_slug: string | null
          id: string | null
          is_active: boolean | null
          kybe_did: string | null
          permissions: Json | null
          platform_account_type: string | null
          role_type: string | null
          scope_description: string | null
          tenant_name: string | null
          tenant_slug: string | null
        }
        Relationships: []
      }
      crm_personas_with_identity: {
        Row: {
          app_origin: string | null
          auth_profile_id: string | null
          created_at: string | null
          default_identity_state: string | null
          display_name: string | null
          email: string | null
          external_user_id: string | null
          fio_handle: string | null
          id: string | null
          identity_id: string | null
          identity_persona_id: string | null
          kybe_did: string | null
          kybe_did_value: string | null
          kybe_state: string | null
          kyc_status: string | null
          persona_dataqube_id: string | null
          persona_state: string | null
          primary_franchise_id: string | null
          primary_wallet_address: string | null
          reputation_bucket: string | null
          reputation_bucket_updated_at: string | null
          reputation_score: number | null
          reputation_updated_at: string | null
          root_did: string | null
          root_did_proxy_id: string | null
          root_did_uri: string | null
          tenant_id: string | null
          updated_at: string | null
          world_id_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_personas_auth_profile_id_fkey"
            columns: ["auth_profile_id"]
            isOneToOne: false
            referencedRelation: "crm_auth_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "crm_personas_with_identity"
            referencedColumns: ["identity_id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona_with_fio_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_persona_dataqube_id_fkey"
            columns: ["persona_dataqube_id"]
            isOneToOne: false
            referencedRelation: "persona_with_reputation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_personas_primary_franchise_id_fkey"
            columns: ["primary_franchise_id"]
            isOneToOne: false
            referencedRelation: "crm_franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_registry_profiles_public: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          is_active: boolean | null
          kybe_did: string | null
          reputation_bucket: string | null
          total_pokw: number | null
          visibility_level: string | null
        }
        Insert: {
          avatar_url?: never
          created_at?: string | null
          display_name?: never
          id?: string | null
          is_active?: boolean | null
          kybe_did?: string | null
          reputation_bucket?: string | null
          total_pokw?: never
          visibility_level?: string | null
        }
        Update: {
          avatar_url?: never
          created_at?: string | null
          display_name?: never
          id?: string | null
          is_active?: boolean | null
          kybe_did?: string | null
          reputation_bucket?: string | null
          total_pokw?: never
          visibility_level?: string | null
        }
        Relationships: []
      }
      crm_user_account_layers: {
        Row: {
          created_at: string | null
          franchise_access: Json | null
          kybe_did: string | null
          origin_layer: string | null
          platform_account_id: string | null
          platform_account_type: string | null
          registry_profile_id: string | null
          tenant_personas: Json | null
        }
        Relationships: []
      }
      persona_with_fio_status: {
        Row: {
          app_origin: string | null
          created_at: string | null
          days_until_expiration: number | null
          default_identity_state: string | null
          fio_handle: string | null
          fio_handle_expiration: string | null
          fio_handle_verified: boolean | null
          fio_last_verified_at: string | null
          fio_public_key: string | null
          fio_registered_at: string | null
          fio_registration_status: string | null
          fio_status: string | null
          fio_tx_id: string | null
          id: string | null
          root_id: string | null
          world_id_status: string | null
        }
        Insert: {
          app_origin?: string | null
          created_at?: string | null
          days_until_expiration?: never
          default_identity_state?: string | null
          fio_handle?: string | null
          fio_handle_expiration?: string | null
          fio_handle_verified?: boolean | null
          fio_last_verified_at?: string | null
          fio_public_key?: string | null
          fio_registered_at?: string | null
          fio_registration_status?: string | null
          fio_status?: never
          fio_tx_id?: string | null
          id?: string | null
          root_id?: string | null
          world_id_status?: string | null
        }
        Update: {
          app_origin?: string | null
          created_at?: string | null
          days_until_expiration?: never
          default_identity_state?: string | null
          fio_handle?: string | null
          fio_handle_expiration?: string | null
          fio_handle_verified?: boolean | null
          fio_last_verified_at?: string | null
          fio_public_key?: string | null
          fio_registered_at?: string | null
          fio_registration_status?: string | null
          fio_status?: never
          fio_tx_id?: string | null
          id?: string | null
          root_id?: string | null
          world_id_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_root_id_fkey"
            columns: ["root_id"]
            isOneToOne: false
            referencedRelation: "root_identity"
            referencedColumns: ["id"]
          },
        ]
      }
      persona_with_reputation: {
        Row: {
          app_origin: string | null
          created_at: string | null
          default_identity_state: string | null
          fio_days_until_expiration: number | null
          fio_handle: string | null
          fio_handle_expiration: string | null
          fio_handle_verified: boolean | null
          fio_last_verified_at: string | null
          fio_public_key: string | null
          fio_registered_at: string | null
          fio_registration_status: string | null
          fio_status: string | null
          fio_tx_id: string | null
          id: string | null
          reputation_bucket: number | null
          reputation_category: string | null
          reputation_evidence_count: number | null
          reputation_last_synced: string | null
          reputation_partition_id: string | null
          reputation_score: number | null
          root_id: string | null
          world_id_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_root_id_fkey"
            columns: ["root_id"]
            isOneToOne: false
            referencedRelation: "root_identity"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      assign_admin_role: { Args: { user_email: string }; Returns: undefined }
      calculate_cvs: {
        Args: {
          p_final_score: number
          p_impact_level: number
          p_impact_multiplier?: number
        }
        Returns: number
      }
      check_admin_access: {
        Args: {
          p_action: string
          p_category_slug?: string
          p_franchise_id?: string
          p_kybe_did: string
          p_tenant_id?: string
        }
        Returns: boolean
      }
      days_until_fio_expiration: {
        Args: { expiration: string }
        Returns: number
      }
      get_agent_addresses: {
        Args: { p_agent_id: string }
        Returns: {
          agent_id: string
          btc_address: string
          evm_address: string
          solana_address: string
        }[]
      }
      get_normalized_rep_weights: {
        Args: { p_task_template_id: string }
        Returns: {
          weight_community: number
          weight_creative: number
          weight_data_arch: number
          weight_entrepreneurial: number
          weight_technical: number
        }[]
      }
      get_user_admin_roles: {
        Args: { p_kybe_did: string }
        Returns: {
          access_level: number
          category_name: string
          franchise_name: string
          permissions: Json
          role_id: string
          role_type: string
          scope_description: string
          tenant_name: string
        }[]
      }
      has_admin_role: { Args: never; Returns: boolean }
      is_fio_handle_expired: { Args: { expiration: string }; Returns: boolean }
      link_crm_persona_to_identity: {
        Args: { p_crm_persona_id: string; p_identity_persona_id: string }
        Returns: boolean
      }
      sync_crm_persona_reputation: {
        Args: {
          p_crm_persona_id: string
          p_reputation_bucket: number
          p_reputation_score: number
        }
        Returns: boolean
      }
      sync_reputation_from_rqh: {
        Args: {
          p_bucket_level: number
          p_evidence_count: number
          p_partition_id: string
          p_rqh_bucket_id?: string
          p_score: number
        }
        Returns: string
      }
      update_persona_reputation: {
        Args: {
          p_cvs?: number
          p_delta_community?: number
          p_delta_creative?: number
          p_delta_data_arch?: number
          p_delta_entrepreneurial?: number
          p_delta_technical?: number
          p_persona_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      content_modality: "read" | "watch" | "listen" | "interact"
      content_status: "draft" | "published" | "archived" | "scheduled"
      content_structure_kind:
        | "episode"
        | "issue"
        | "article"
        | "series"
        | "collection"
      entitlement_acquisition:
        | "purchase"
        | "subscription"
        | "rental"
        | "gift"
        | "reward"
        | "free"
      entitlement_scope: "full" | "preview" | "rental" | "subscription"
      expiry_model:
        | "permanent"
        | "rental"
        | "subscription"
        | "timeLimited"
        | "usageLimited"
      identity_state: "anonymous" | "pseudo" | "semi" | "full"
      payment_currency:
        | "QCT"
        | "QOYN"
        | "KNYT"
        | "USDC"
        | "ETH"
        | "BTC"
        | "sats"
      pricing_kind:
        | "payPerPanel"
        | "payPerEpisode"
        | "payPerStream"
        | "payPerArticle"
        | "payPerIssue"
        | "payPerSeries"
        | "subscription"
        | "bundle"
        | "free"
      relationship_entity_type:
        | "SmartContentQube"
        | "Persona"
        | "Agent"
        | "Series"
        | "Collection"
        | "Quest"
        | "Shelf"
      relationship_type:
        | "sequence"
        | "branch"
        | "series"
        | "collection"
        | "reference"
        | "prerequisite"
        | "questPath"
        | "playlist"
      smart_content_app: "metaKnyts" | "Qriptopian" | "AgentiQ"
      storage_provider: "supabase" | "ipfs" | "autonomys" | "cdn" | "external"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_modality: ["read", "watch", "listen", "interact"],
      content_status: ["draft", "published", "archived", "scheduled"],
      content_structure_kind: [
        "episode",
        "issue",
        "article",
        "series",
        "collection",
      ],
      entitlement_acquisition: [
        "purchase",
        "subscription",
        "rental",
        "gift",
        "reward",
        "free",
      ],
      entitlement_scope: ["full", "preview", "rental", "subscription"],
      expiry_model: [
        "permanent",
        "rental",
        "subscription",
        "timeLimited",
        "usageLimited",
      ],
      identity_state: ["anonymous", "pseudo", "semi", "full"],
      payment_currency: ["QCT", "QOYN", "KNYT", "USDC", "ETH", "BTC", "sats"],
      pricing_kind: [
        "payPerPanel",
        "payPerEpisode",
        "payPerStream",
        "payPerArticle",
        "payPerIssue",
        "payPerSeries",
        "subscription",
        "bundle",
        "free",
      ],
      relationship_entity_type: [
        "SmartContentQube",
        "Persona",
        "Agent",
        "Series",
        "Collection",
        "Quest",
        "Shelf",
      ],
      relationship_type: [
        "sequence",
        "branch",
        "series",
        "collection",
        "reference",
        "prerequisite",
        "questPath",
        "playlist",
      ],
      smart_content_app: ["metaKnyts", "Qriptopian", "AgentiQ"],
      storage_provider: ["supabase", "ipfs", "autonomys", "cdn", "external"],
    },
  },
} as const
