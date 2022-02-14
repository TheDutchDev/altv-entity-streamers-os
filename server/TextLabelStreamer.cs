using AltV.Net.Data;
using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace AltV.Streamers;

/// <summary>
/// DynamicTextLabel class that stores all data related to a single textlabel
/// </summary>
public class DynamicTextLabel : Entity
{
    private ulong EntityType
    {
        get
        {
            if( !TryGetData( "entityType", out ulong type ) )
                return 999;

            return type;
        }
        set
        {
            // No data changed
            if( EntityType == value )
                return;

            SetData( "entityType", value );
        }
    }

    /// <summary>
    /// Set/get or get the current textlabel's scale.
    /// </summary>
    public float? Scale
    {
        get
        {
            if( !TryGetData( "scale", out float scale ) )
                return null;

            return scale;
        }
        set { SetData( "scale", value ); }
    }

    /// <summary>
    /// Set/get the textlabel's text.
    /// </summary>
    public string Text
    {
        get
        {
            if( !TryGetData( "text", out string text ) )
                return null;

            return text;
        }
        set { SetData( "text", value ); }
    }

    /// <summary>
    /// Set/get textlabel's color.
    /// </summary>
    public Rgba Color
    {
        get
        {
            if( !TryGetData( "color", out Dictionary<string, object> data ) )
                return default;

            return new Rgba()
            {
                R = Convert.ToByte( data[ "r" ] ),
                G = Convert.ToByte( data[ "g" ] ),
                B = Convert.ToByte( data[ "b" ] ),
                A = Convert.ToByte( data[ "a" ] ),
            };
        }
        set
        {
            // No data changed
            if( Color.R == value.R && Color.G == value.G && Color.B == value.B && Color.A == value.A )
                return;

            Dictionary<string, object> dict = new Dictionary<string, object>()
            {
                [ "r" ] = Convert.ToInt32( value.R ),
                [ "g" ] = Convert.ToInt32( value.G ),
                [ "b" ] = Convert.ToInt32( value.B ),
                [ "a" ] = Convert.ToInt32( value.A ),
            };
            SetData( "color", dict );
        }
    }

    public DynamicTextLabel( Vector3 position, int dimension, uint range, ulong entityType ) : base( entityType,
        position, dimension, range )
    {
        EntityType = entityType;
    }

    /// <summary>
    /// Destroy this textlabel.
    /// </summary>
    public void Destroy( )
    {
        AltEntitySync.RemoveEntity( this );
    }
}

public static class TextLabelStreamer
{
    /// <summary>
    /// Create a new dynamic textlabel.
    /// </summary>
    /// <param name="text">The text to be displayed.</param>
    /// <param name="position">The position to spawn it at.</param>
    /// <param name="dimension">The dimension to spawn it in.</param>
    /// <param name="color">The color of the textlabel.</param>
    /// <param name="scale">The scale of the textlabel.</param>
    /// <param name="streamRange">Stream range, default is 30.</param>
    /// <returns>The newly created dynamic textlabel.</returns>
    public static DynamicTextLabel CreateDynamicTextLabel(
        string text, Vector3 position, int dimension = 0, Rgba? color = null, int? scale = null, uint streamRange = 25
    )
    {
        DynamicTextLabel textLabel =
            new DynamicTextLabel( position, dimension, streamRange, AltStreamers.ENTITY_TYPE_TEXTLABEL )
            {
                Color = color ?? new Rgba( 255, 255, 255, 255 ),
                Text = text,
                Scale = scale ?? 1
            };

        AltEntitySync.AddEntity( textLabel );
        return textLabel;
    }

    /// <summary>
    /// Destroy a dynamic text label by it's ID.
    /// </summary>
    /// <param name="dynamicTextLabelId">The ID of the text label.</param>
    /// <returns>True if successful, false otherwise.</returns>
    public static bool DestroyDynamicTextLabel( ulong dynamicTextLabelId )
    {
        DynamicTextLabel obj = GetDynamicTextLabel( dynamicTextLabelId );

        if( obj == null )
            return false;

        AltEntitySync.RemoveEntity( obj );
        return true;
    }

    /// <summary>
    /// Destroy a dynamic text label.
    /// </summary>
    /// <param name="dynamicTextLabel">The text label instance to destroy.</param>
    public static void DestroyDynamicTextLabel( DynamicTextLabel dynamicTextLabel )
    {
        AltEntitySync.RemoveEntity( dynamicTextLabel );
    }

    /// <summary>
    /// Get a dynamic text label by it's ID.
    /// </summary>
    /// <param name="dynamicTextLabelId">The ID of the textlabel.</param>
    /// <returns>The dynamic textlabel or null if not found.</returns>
    public static DynamicTextLabel GetDynamicTextLabel( ulong dynamicTextLabelId )
    {
        if( !AltEntitySync.TryGetEntity( dynamicTextLabelId, 1, out IEntity entity ) )
        {
            Console.WriteLine(
                $"[TEXTLABEL-STREAMER] [GetDynamicTextLabel] ERROR: Entity with ID {dynamicTextLabelId} couldn't be found." );
            return null;
        }

        return ( DynamicTextLabel ) entity;
    }

    /// <summary>
    /// Destroy all created dynamic textlabels.
    /// </summary>
    public static void DestroyAllDynamicTextLabels( )
    {
        foreach( DynamicTextLabel obj in GetAllDynamicTextLabels() )
        {
            AltEntitySync.RemoveEntity( obj );
        }
    }

    /// <summary>
    /// Get all created dynamic textlabels.
    /// </summary>
    /// <returns>A list of dynamic textlabels.</returns>
    public static List<DynamicTextLabel> GetAllDynamicTextLabels( )
    {
        List<DynamicTextLabel> textLabels = new List<DynamicTextLabel>();

        foreach( IEntity entity in AltEntitySync.GetAllEntities() )
        {
            if( entity.Type != AltStreamers.ENTITY_TYPE_TEXTLABEL )
                continue;

            DynamicTextLabel textLabel = GetDynamicTextLabel( entity.Id );

            if( textLabel != null )
                textLabels.Add( textLabel );
        }

        return textLabels;
    }
}