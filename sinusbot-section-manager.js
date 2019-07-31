registerPlugin({
    name: 'Sinusbot-Section-Manager',
    author: 'Andreas Fahrecker <andreasfahrecker@gmail.com>',
    description: 'This Script manages the configured Channel Sections',
    version: '1.0',
    backends: ['ts3'],
    enableWeb: true,
    //engine: ,
    requiredModules: ['http'],
    vars: []
}, function (_, config, meta) {
    class ChannelSection {
        constructor(name, parent, codec, codecQuality, encrypted, permissions) {
            this.name = name;
            this.parent = parent;
            this.codec = codec;
            this.codecQuality = codecQuality;
            this.encrypted = encrypted;
            this.permissions = permissions;
        }

        get codec() {
            return this._codec;
        }

        set codec(codec) {
            this._codec = parseInt(codec);
        }

        get codecQuality() {
            return this._codecQuality;
        }

        set codecQuality(codecQuality) {
            this._codecQuality = parseInt(codecQuality);
        }

        _validateName() {
            return Boolean(this.name.trim());
        }

        _validateParent(channels) {
            return this.parent ? channels.filter(channel => {
                return channel.id() === this.parent.toString()
            }).length >= 1 : false;
        }

        _validateCodec() {
            return this.codec >= 0 && this.codec <= 5;
        }

        _validateCodecQuality() {
            return this.codecQuality >= 0 && this.codecQuality <= 10;
        }

        _validateEncrypted() {
            return (this.encrypted === true || this.encrypted === false);
        }

        _validatePermissions() {
            return this.permissions ? (this.permissions.length > 0 ? this.permissions.every(perm => {
                return Object.assign(new ChannelPermission(), perm).validateChannelPermission()
            }) : true) : false;
        }

        validateChannelSection(possibleChannels) {
            return this._validateName() && this._validateParent(possibleChannels) &&
                this._validateCodec() && this._validateCodecQuality() && this._validateEncrypted() &&
                this._validatePermissions();
        }

        toJSONString() {
            return JSON.stringify(this);
        }

        static fromJSON(serializedJSON) {
            return Object.assign(new ChannelSection(), JSON.parse(serializedJSON));
        }
    }

    class ChannelPermission {
        constructor(id, value) {
            this.id = id;
            this.value = value;
        }

        get value() {
            return this._value;
        }

        set value(value) {
            this._value = parseInt(value);
        }

        _validateId() {
            const channelPermissionIds = [
                'b_serverinstance_help_view', 'b_serverinstance_version_view', 'b_serverinstance_info_view', 'b_serverinstance_virtualserver_list', 'b_serverinstance_binding_list', 'b_serverinstance_permission_list', 'b_serverinstance_permission_find', 'b_virtualserver_create', 'b_virtualserver_delete', 'b_virtualserver_start_any', 'b_virtualserver_stop_any', 'b_virtualserver_change_machine_id', 'b_virtualserver_change_template', 'b_serverquery_login', 'b_serverinstance_textmessage_send', 'b_serverinstance_log_view', 'b_serverinstance_log_add', 'b_serverinstance_stop', 'b_serverinstance_modify_settings', 'b_serverinstance_modify_querygroup', 'b_serverinstance_modify_templates', 'b_virtualserver_select', 'b_virtualserver_info_view', 'b_virtualserver_connectioninfo_view', 'b_virtualserver_channel_list', 'b_virtualserver_channel_search', 'b_virtualserver_client_list', 'b_virtualserver_client_search', 'b_virtualserver_client_dblist', 'b_virtualserver_client_dbsearch', 'b_virtualserver_client_dbinfo', 'b_virtualserver_permission_find', 'b_virtualserver_custom_search', 'b_virtualserver_start', 'b_virtualserver_stop', 'b_virtualserver_token_list', 'b_virtualserver_token_add', 'b_virtualserver_token_use', 'b_virtualserver_token_delete', 'b_virtualserver_log_view', 'b_virtualserver_log_add', 'b_virtualserver_join_ignore_password', 'b_virtualserver_notify_register', 'b_virtualserver_notify_unregister', 'b_virtualserver_snapshot_create', 'b_virtualserver_snapshot_deploy', 'b_virtualserver_permission_reset', 'b_virtualserver_modify_name', 'b_virtualserver_modify_welcomemessage', 'b_virtualserver_modify_maxclients', 'b_virtualserver_modify_reserved_slots', 'b_virtualserver_modify_password', 'b_virtualserver_modify_default_servergroup', 'b_virtualserver_modify_default_channelgroup', 'b_virtualserver_modify_default_channeladmingroup', 'b_virtualserver_modify_channel_forced_silence', 'b_virtualserver_modify_complain', 'b_virtualserver_modify_antiflood', 'b_virtualserver_modify_ft_settings', 'b_virtualserver_modify_ft_quotas', 'b_virtualserver_modify_hostmessage', 'b_virtualserver_modify_hostbanner', 'b_virtualserver_modify_hostbutton', 'b_virtualserver_modify_port', 'b_virtualserver_modify_autostart', 'b_virtualserver_modify_needed_identity_security_level', 'b_virtualserver_modify_priority_speaker_dimm_modificator', 'b_virtualserver_modify_log_settings', 'b_virtualserver_modify_min_client_version', 'b_virtualserver_modify_icon_id', 'b_virtualserver_modify_weblist', 'b_virtualserver_modify_codec_encryption_mode', 'b_virtualserver_modify_temporary_passwords', 'b_virtualserver_modify_temporary_passwords_own', 'i_channel_min_depth', 'i_channel_max_depth', 'b_channel_group_inheritance_end', 'i_channel_permission_modify_power', 'i_channel_needed_permission_modify_power', 'b_channel_info_view', 'b_channel_create_child', 'b_channel_create_permanent', 'b_channel_create_semi_permanent', 'b_channel_create_temporary', 'b_channel_create_with_topic', 'b_channel_create_with_description', 'b_channel_create_with_password', 'b_channel_create_modify_with_codec_speex8', 'b_channel_create_modify_with_codec_speex16', 'b_channel_create_modify_with_codec_speex32', 'b_channel_create_modify_with_codec_celtmono48', 'i_channel_create_modify_with_codec_maxquality', 'i_channel_create_modify_with_codec_latency_factor_min', 'b_channel_create_with_maxclients', 'b_channel_create_with_maxfamilyclients', 'b_channel_create_with_sortorder', 'b_channel_create_with_default', 'b_channel_create_with_needed_talk_power', 'b_channel_create_modify_with_force_password', 'b_channel_modify_parent', 'b_channel_modify_make_default', 'b_channel_modify_make_permanent', 'b_channel_modify_make_semi_permanent', 'b_channel_modify_make_temporary', 'b_channel_modify_name', 'b_channel_modify_topic', 'b_channel_modify_description', 'b_channel_modify_password', 'b_channel_modify_codec', 'b_channel_modify_codec_quality', 'b_channel_modify_codec_latency_factor', 'b_channel_modify_maxclients', 'b_channel_modify_maxfamilyclients', 'b_channel_modify_sortorder', 'b_channel_modify_needed_talk_power', 'i_channel_modify_power', 'i_channel_needed_modify_power', 'b_channel_modify_make_codec_encrypted', 'b_channel_delete_permanent', 'b_channel_delete_semi_permanent', 'b_channel_delete_temporary', 'b_channel_delete_flag_force', 'i_channel_delete_power', 'i_channel_needed_delete_power', 'b_channel_join_permanent', 'b_channel_join_semi_permanent', 'b_channel_join_temporary', 'b_channel_join_ignore_password', 'b_channel_join_ignore_maxclients', 'i_channel_join_power', 'i_channel_needed_join_power', 'i_channel_subscribe_power', 'i_channel_needed_subscribe_power', 'i_channel_description_view_power', 'i_channel_needed_description_view_power', 'i_icon_id', 'i_max_icon_filesize', 'b_icon_manage', 'b_group_is_permanent', 'i_group_auto_update_type', 'i_group_auto_update_max_value', 'i_group_sort_id', 'i_group_show_name_in_tree', 'b_virtualserver_servergroup_list', 'b_virtualserver_servergroup_permission_list', 'b_virtualserver_servergroup_client_list', 'b_virtualserver_channelgroup_list', 'b_virtualserver_channelgroup_permission_list', 'b_virtualserver_channelgroup_client_list', 'b_virtualserver_client_permission_list', 'b_virtualserver_channel_permission_list', 'b_virtualserver_channelclient_permission_list', 'b_virtualserver_servergroup_create', 'b_virtualserver_channelgroup_create', 'i_group_modify_power', 'i_group_needed_modify_power', 'i_group_member_add_power', 'i_group_needed_member_add_power', 'i_group_member_remove_power', 'i_group_needed_member_remove_power', 'i_permission_modify_power', 'b_permission_modify_power_ignore', 'b_virtualserver_servergroup_delete', 'b_virtualserver_channelgroup_delete', 'i_client_permission_modify_power', 'i_client_needed_permission_modify_power', 'i_client_max_clones_uid', 'i_client_max_idletime', 'i_client_max_avatar_filesize', 'i_client_max_channel_subscriptions', 'b_client_is_priority_speaker', 'b_client_skip_channelgroup_permissions', 'b_client_force_push_to_talk', 'b_client_ignore_bans', 'b_client_ignore_antiflood', 'b_client_issue_client_query_command', 'b_client_use_reserved_slot', 'b_client_use_channel_commander', 'b_client_request_talker', 'b_client_avatar_delete_other', 'b_client_is_sticky', 'b_client_ignore_sticky', 'b_client_info_view', 'b_client_permissionoverview_view', 'b_client_permissionoverview_own', 'b_client_remoteaddress_view', 'i_client_serverquery_view_power', 'i_client_needed_serverquery_view_power', 'b_client_custom_info_view', 'i_client_kick_from_server_power', 'i_client_needed_kick_from_server_power', 'i_client_kick_from_channel_power', 'i_client_needed_kick_from_channel_power', 'i_client_ban_power', 'i_client_needed_ban_power', 'i_client_move_power', 'i_client_needed_move_power', 'i_client_complain_power', 'i_client_needed_complain_power', 'b_client_complain_list', 'b_client_complain_delete_own', 'b_client_complain_delete', 'b_client_ban_list', 'b_client_ban_create', 'b_client_ban_delete_own', 'b_client_ban_delete', 'i_client_ban_max_bantime', 'i_client_private_textmessage_power', 'i_client_needed_private_textmessage_power', 'b_client_server_textmessage_send', 'b_client_channel_textmessage_send', 'b_client_offline_textmessage_send', 'i_client_talk_power', 'i_client_needed_talk_power', 'i_client_poke_power', 'i_client_needed_poke_power', 'b_client_set_flag_talker', 'i_client_whisper_power', 'i_client_needed_whisper_power', 'b_client_modify_description', 'b_client_modify_own_description', 'b_client_modify_dbproperties', 'b_client_delete_dbproperties', 'b_client_create_modify_serverquery_login', 'b_ft_ignore_password', 'b_ft_transfer_list', 'i_ft_file_upload_power', 'i_ft_needed_file_upload_power', 'i_ft_file_download_power', 'i_ft_needed_file_download_power', 'i_ft_file_delete_power', 'i_ft_needed_file_delete_power', 'i_ft_file_rename_power', 'i_ft_needed_file_rename_power', 'i_ft_file_browse_power', 'i_ft_needed_file_browse_power', 'i_ft_directory_create_power', 'i_ft_needed_directory_create_power', 'i_ft_quota_mb_download_per_client', 'i_ft_quota_mb_upload_per_client', 'i_needed_modify_power_serverinstance_help_view', 'i_needed_modify_power_serverinstance_version_view', 'i_needed_modify_power_serverinstance_info_view', 'i_needed_modify_power_serverinstance_virtualserver_list', 'i_needed_modify_power_serverinstance_binding_list', 'i_needed_modify_power_serverinstance_permission_list', 'i_needed_modify_power_serverinstance_permission_find', 'i_needed_modify_power_virtualserver_create', 'i_needed_modify_power_virtualserver_delete', 'i_needed_modify_power_virtualserver_start_any', 'i_needed_modify_power_virtualserver_stop_any', 'i_needed_modify_power_virtualserver_change_machine_id', 'i_needed_modify_power_virtualserver_change_template', 'i_needed_modify_power_serverquery_login', 'i_needed_modify_power_serverinstance_textmessage_send', 'i_needed_modify_power_serverinstance_log_view', 'i_needed_modify_power_serverinstance_log_add', 'i_needed_modify_power_serverinstance_stop', 'i_needed_modify_power_serverinstance_modify_settings', 'i_needed_modify_power_serverinstance_modify_querygroup', 'i_needed_modify_power_serverinstance_modify_templates', 'i_needed_modify_power_virtualserver_select', 'i_needed_modify_power_virtualserver_info_view', 'i_needed_modify_power_virtualserver_connectioninfo_view', 'i_needed_modify_power_virtualserver_channel_list', 'i_needed_modify_power_virtualserver_channel_search', 'i_needed_modify_power_virtualserver_client_list', 'i_needed_modify_power_virtualserver_client_search', 'i_needed_modify_power_virtualserver_client_dblist', 'i_needed_modify_power_virtualserver_client_dbsearch', 'i_needed_modify_power_virtualserver_client_dbinfo', 'i_needed_modify_power_virtualserver_permission_find', 'i_needed_modify_power_virtualserver_custom_search', 'i_needed_modify_power_virtualserver_start', 'i_needed_modify_power_virtualserver_stop', 'i_needed_modify_power_virtualserver_token_list', 'i_needed_modify_power_virtualserver_token_add', 'i_needed_modify_power_virtualserver_token_use', 'i_needed_modify_power_virtualserver_token_delete', 'i_needed_modify_power_virtualserver_log_view', 'i_needed_modify_power_virtualserver_log_add', 'i_needed_modify_power_virtualserver_join_ignore_password', 'i_needed_modify_power_virtualserver_notify_register', 'i_needed_modify_power_virtualserver_notify_unregister', 'i_needed_modify_power_virtualserver_snapshot_create', 'i_needed_modify_power_virtualserver_snapshot_deploy', 'i_needed_modify_power_virtualserver_permission_reset', 'i_needed_modify_power_virtualserver_modify_name', 'i_needed_modify_power_virtualserver_modify_welcomemessage', 'i_needed_modify_power_virtualserver_modify_maxclients', 'i_needed_modify_power_virtualserver_modify_reserved_slots', 'i_needed_modify_power_virtualserver_modify_password', 'i_needed_modify_power_virtualserver_modify_default_servergroup', 'i_needed_modify_power_virtualserver_modify_default_channelgroup', 'i_needed_modify_power_virtualserver_modify_default_channeladmingroup', 'i_needed_modify_power_virtualserver_modify_channel_forced_silence', 'i_needed_modify_power_virtualserver_modify_complain', 'i_needed_modify_power_virtualserver_modify_antiflood', 'i_needed_modify_power_virtualserver_modify_ft_settings', 'i_needed_modify_power_virtualserver_modify_ft_quotas', 'i_needed_modify_power_virtualserver_modify_hostmessage', 'i_needed_modify_power_virtualserver_modify_hostbanner', 'i_needed_modify_power_virtualserver_modify_hostbutton', 'i_needed_modify_power_virtualserver_modify_port', 'i_needed_modify_power_virtualserver_modify_autostart', 'i_needed_modify_power_virtualserver_modify_needed_identity_security_level', 'i_needed_modify_power_virtualserver_modify_priority_speaker_dimm_modificator', 'i_needed_modify_power_virtualserver_modify_log_settings', 'i_needed_modify_power_virtualserver_modify_min_client_version', 'i_needed_modify_power_virtualserver_modify_icon_id', 'i_needed_modify_power_virtualserver_modify_weblist', 'i_needed_modify_power_virtualserver_modify_codec_encryption_mode', 'i_needed_modify_power_virtualserver_modify_temporary_passwords', 'i_needed_modify_power_virtualserver_modify_temporary_passwords_own', 'i_needed_modify_power_channel_min_depth', 'i_needed_modify_power_channel_max_depth', 'i_needed_modify_power_channel_group_inheritance_end', 'i_needed_modify_power_channel_permission_modify_power', 'i_needed_modify_power_channel_needed_permission_modify_power', 'i_needed_modify_power_channel_info_view', 'i_needed_modify_power_channel_create_child', 'i_needed_modify_power_channel_create_permanent', 'i_needed_modify_power_channel_create_semi_permanent', 'i_needed_modify_power_channel_create_temporary', 'i_needed_modify_power_channel_create_with_topic', 'i_needed_modify_power_channel_create_with_description', 'i_needed_modify_power_channel_create_with_password', 'i_needed_modify_power_channel_create_modify_with_codec_speex8', 'i_needed_modify_power_channel_create_modify_with_codec_speex16', 'i_needed_modify_power_channel_create_modify_with_codec_speex32', 'i_needed_modify_power_channel_create_modify_with_codec_celtmono48', 'i_needed_modify_power_channel_create_modify_with_codec_maxquality', 'i_needed_modify_power_channel_create_modify_with_codec_latency_factor_min', 'i_needed_modify_power_channel_create_with_maxclients', 'i_needed_modify_power_channel_create_with_maxfamilyclients', 'i_needed_modify_power_channel_create_with_sortorder', 'i_needed_modify_power_channel_create_with_default', 'i_needed_modify_power_channel_create_with_needed_talk_power', 'i_needed_modify_power_channel_create_modify_with_force_password', 'i_needed_modify_power_channel_modify_parent', 'i_needed_modify_power_channel_modify_make_default', 'i_needed_modify_power_channel_modify_make_permanent', 'i_needed_modify_power_channel_modify_make_semi_permanent', 'i_needed_modify_power_channel_modify_make_temporary', 'i_needed_modify_power_channel_modify_name', 'i_needed_modify_power_channel_modify_topic', 'i_needed_modify_power_channel_modify_description', 'i_needed_modify_power_channel_modify_password', 'i_needed_modify_power_channel_modify_codec', 'i_needed_modify_power_channel_modify_codec_quality', 'i_needed_modify_power_channel_modify_codec_latency_factor', 'i_needed_modify_power_channel_modify_maxclients', 'i_needed_modify_power_channel_modify_maxfamilyclients', 'i_needed_modify_power_channel_modify_sortorder', 'i_needed_modify_power_channel_modify_needed_talk_power', 'i_needed_modify_power_channel_modify_power', 'i_needed_modify_power_channel_needed_modify_power', 'i_needed_modify_power_channel_modify_make_codec_encrypted', 'i_needed_modify_power_channel_delete_permanent', 'i_needed_modify_power_channel_delete_semi_permanent', 'i_needed_modify_power_channel_delete_temporary', 'i_needed_modify_power_channel_delete_flag_force', 'i_needed_modify_power_channel_delete_power', 'i_needed_modify_power_channel_needed_delete_power', 'i_needed_modify_power_channel_join_permanent', 'i_needed_modify_power_channel_join_semi_permanent', 'i_needed_modify_power_channel_join_temporary', 'i_needed_modify_power_channel_join_ignore_password', 'i_needed_modify_power_channel_join_ignore_maxclients', 'i_needed_modify_power_channel_join_power', 'i_needed_modify_power_channel_needed_join_power', 'i_needed_modify_power_channel_subscribe_power', 'i_needed_modify_power_channel_needed_subscribe_power', 'i_needed_modify_power_channel_description_view_power', 'i_needed_modify_power_channel_needed_description_view_power', 'i_needed_modify_power_icon_id', 'i_needed_modify_power_max_icon_filesize', 'i_needed_modify_power_icon_manage', 'i_needed_modify_power_group_is_permanent', 'i_needed_modify_power_group_auto_update_type', 'i_needed_modify_power_group_auto_update_max_value', 'i_needed_modify_power_group_sort_id', 'i_needed_modify_power_group_show_name_in_tree', 'i_needed_modify_power_virtualserver_servergroup_list', 'i_needed_modify_power_virtualserver_servergroup_permission_list', 'i_needed_modify_power_virtualserver_servergroup_client_list', 'i_needed_modify_power_virtualserver_channelgroup_list', 'i_needed_modify_power_virtualserver_channelgroup_permission_list', 'i_needed_modify_power_virtualserver_channelgroup_client_list', 'i_needed_modify_power_virtualserver_client_permission_list', 'i_needed_modify_power_virtualserver_channel_permission_list', 'i_needed_modify_power_virtualserver_channelclient_permission_list', 'i_needed_modify_power_virtualserver_servergroup_create', 'i_needed_modify_power_virtualserver_channelgroup_create', 'i_needed_modify_power_group_modify_power', 'i_needed_modify_power_group_needed_modify_power', 'i_needed_modify_power_group_member_add_power', 'i_needed_modify_power_group_needed_member_add_power', 'i_needed_modify_power_group_member_remove_power', 'i_needed_modify_power_group_needed_member_remove_power', 'i_needed_modify_power_permission_modify_power', 'i_needed_modify_power_permission_modify_power_ignore', 'i_needed_modify_power_virtualserver_servergroup_delete', 'i_needed_modify_power_virtualserver_channelgroup_delete', 'i_needed_modify_power_client_permission_modify_power', 'i_needed_modify_power_client_needed_permission_modify_power', 'i_needed_modify_power_client_max_clones_uid', 'i_needed_modify_power_client_max_idletime', 'i_needed_modify_power_client_max_avatar_filesize', 'i_needed_modify_power_client_max_channel_subscriptions', 'i_needed_modify_power_client_is_priority_speaker', 'i_needed_modify_power_client_skip_channelgroup_permissions', 'i_needed_modify_power_client_force_push_to_talk', 'i_needed_modify_power_client_ignore_bans', 'i_needed_modify_power_client_ignore_antiflood', 'i_needed_modify_power_client_issue_client_query_command', 'i_needed_modify_power_client_use_reserved_slot', 'i_needed_modify_power_client_use_channel_commander', 'i_needed_modify_power_client_request_talker', 'i_needed_modify_power_client_avatar_delete_other', 'i_needed_modify_power_client_is_sticky', 'i_needed_modify_power_client_ignore_sticky', 'i_needed_modify_power_client_info_view', 'i_needed_modify_power_client_permissionoverview_view', 'i_needed_modify_power_client_permissionoverview_own', 'i_needed_modify_power_client_remoteaddress_view', 'i_needed_modify_power_client_serverquery_view_power', 'i_needed_modify_power_client_needed_serverquery_view_power', 'i_needed_modify_power_client_custom_info_view', 'i_needed_modify_power_client_kick_from_server_power', 'i_needed_modify_power_client_needed_kick_from_server_power', 'i_needed_modify_power_client_kick_from_channel_power', 'i_needed_modify_power_client_needed_kick_from_channel_power', 'i_needed_modify_power_client_ban_power', 'i_needed_modify_power_client_needed_ban_power', 'i_needed_modify_power_client_move_power', 'i_needed_modify_power_client_needed_move_power', 'i_needed_modify_power_client_complain_power', 'i_needed_modify_power_client_needed_complain_power', 'i_needed_modify_power_client_complain_list', 'i_needed_modify_power_client_complain_delete_own', 'i_needed_modify_power_client_complain_delete', 'i_needed_modify_power_client_ban_list', 'i_needed_modify_power_client_ban_create', 'i_needed_modify_power_client_ban_delete_own', 'i_needed_modify_power_client_ban_delete', 'i_needed_modify_power_client_ban_max_bantime', 'i_needed_modify_power_client_private_textmessage_power', 'i_needed_modify_power_client_needed_private_textmessage_power', 'i_needed_modify_power_client_server_textmessage_send', 'i_needed_modify_power_client_channel_textmessage_send', 'i_needed_modify_power_client_offline_textmessage_send', 'i_needed_modify_power_client_talk_power', 'i_needed_modify_power_client_needed_talk_power', 'i_needed_modify_power_client_poke_power', 'i_needed_modify_power_client_needed_poke_power', 'i_needed_modify_power_client_set_flag_talker', 'i_needed_modify_power_client_whisper_power', 'i_needed_modify_power_client_needed_whisper_power', 'i_needed_modify_power_client_modify_description', 'i_needed_modify_power_client_modify_own_description', 'i_needed_modify_power_client_modify_dbproperties', 'i_needed_modify_power_client_delete_dbproperties', 'i_needed_modify_power_client_create_modify_serverquery_login', 'i_needed_modify_power_ft_ignore_password', 'i_needed_modify_power_ft_transfer_list', 'i_needed_modify_power_ft_file_upload_power', 'i_needed_modify_power_ft_needed_file_upload_power', 'i_needed_modify_power_ft_file_download_power', 'i_needed_modify_power_ft_needed_file_download_power', 'i_needed_modify_power_ft_file_delete_power', 'i_needed_modify_power_ft_needed_file_delete_power', 'i_needed_modify_power_ft_file_rename_power', 'i_needed_modify_power_ft_needed_file_rename_power', 'i_needed_modify_power_ft_file_browse_power', 'i_needed_modify_power_ft_needed_file_browse_power', 'i_needed_modify_power_ft_directory_create_power', 'i_needed_modify_power_ft_needed_directory_create_power', 'i_needed_modify_power_ft_quota_mb_download_per_client', 'i_needed_modify_power_ft_quota_mb_upload_per_client'
            ];
            return channelPermissionIds.includes(this.id);
        }

        _validateValue() {
            return typeof this.value === 'number';
        }

        validateChannelPermission() {
            return this._validateId() && this._validateValue();
        }

        toJSONString() {
            return JSON.stringify(this);
        }

        static fromJSON(serializedJSON) {
            return Object.assign(new ChannelPermission(), JSON.parse(serializedJSON));
        }
    }

    const storeKeys = {
        channelSections: 'channelSections'
    };

    const engine = require('engine');
    const store = require('store');
    const backend = require('backend');
    const event = require('event');

    function getChannelSections() {
        return store.get(storeKeys.channelSections);
    }

    function getChannelSection(channelParentId) {
        return store.get(storeKeys.channelSections).filter(channelSection => channelSection.parent === channelParentId);
    }

    function saveChannelSection(sectionChannel) {
        let channelSectionUpdated = false;
        let channelSections = getChannelSections();
        for (let i = 0; i < channelSections.length; i++) {
            if (channelSections[i].parent === sectionChannel.parent) {
                channelSections[i] = sectionChannel;
                channelSectionUpdated = true;
            }
        }
        if (!channelSectionUpdated) {
            channelSections.push(sectionChannel);
        }
        store.set(storeKeys.channelSections, channelSections);
    }

    /**
     *
     */
    event.on('api:createChannelSection', ev => {
        let channelSection = ChannelSection.fromJSON(ev.data().channelSection);
        engine.log('Channel Section: ' + channelSection.toJSONString());
        engine.log('Validate Name: ' + channelSection._validateName());
        engine.log('Validate Parent: ' + channelSection._validateParent(backend.getChannels()));
        engine.log('Validate Codec: ' + channelSection._validateCodec());
        engine.log('Validate Codec Quality: ' + channelSection._validateCodecQuality());
        engine.log('Validate Encrypted: ' + channelSection._validateEncrypted());
        engine.log('Validate Permissions: ' + channelSection._validatePermissions());
        engine.log('Validate ChannelSection: ' + channelSection.validateChannelSection(backend.getChannels()));
    });

    event.on('api:getChannelSections', ev => {
        channelSections: getChannelSections()
    });
});