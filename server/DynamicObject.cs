using System;
using System.Collections.Generic;
using System.Numerics;
using AltV.Net.EntitySync;

namespace AltV.Streamers;

/// <summary>
/// DynamicObject class that stores all data related to a single object
/// </summary>
public class DynamicObject : Entity, IDynamicObject
{
    /// <summary>
    /// Set or get the current object's rotation (in degrees).
    /// </summary>
    public Vector3 Rotation
    {
        get
        {
            if( !TryGetData( "rotation", out Dictionary<string, object> data ) )
                return default;

            return new Vector3()
            {
                X = Convert.ToSingle( data[ "x" ] ),
                Y = Convert.ToSingle( data[ "y" ] ),
                Z = Convert.ToSingle( data[ "z" ] ),
            };
        }
        set
        {
            // No data changed
            if( Rotation.X == value.X && Rotation.Y == value.Y && Rotation.Z == value.Z &&
                value != new Vector3( 0, 0, 0 ) )
                return;

            Dictionary<string, object> dict = new Dictionary<string, object>()
            {
                [ "x" ] = value.X,
                [ "y" ] = value.Y,
                [ "z" ] = value.Z,
            };

            SetData( "rotation", dict );
        }
    }

    /// <summary>
    /// Set or get the current object's model.
    /// </summary>
    public string Model
    {
        get
        {
            if( !TryGetData( "model", out string model ) )
                return null;

            return model;
        }
        set
        {
            // No data changed
            if( Model == value )
                return;

            SetData( "model", value );
        }
    }

    /// <summary>
    /// Set or get LOD Distance of the object.
    /// </summary>
    public uint? LodDistance
    {
        get
        {
            if( !TryGetData( "lodDistance", out uint lodDist ) )
                return null;

            return lodDist;
        }
        set
        {
            // if value is set to null, reset the data
            if( value == null )
            {
                SetData( "lodDistance", null );
                return;
            }

            // No data changed
            if( LodDistance == value )
                return;

            SetData( "lodDistance", value );
        }
    }

    /// <summary>
    /// Get or set the current texture variation, use null to reset it to default.
    /// </summary>
    public TextureVariation? TextureVariation
    {
        get
        {
            if( !TryGetData( "textureVariation", out int variation ) )
                return null;

            return ( TextureVariation ) variation;
        }
        set
        {
            // if value is set to null, reset the data
            if( value == null )
            {
                SetData( "textureVariation", null );
                return;
            }

            // No data changed
            if( TextureVariation == value )
                return;

            SetData( "textureVariation", ( int ) value );
        }
    }

    /// <summary>
    /// Get or set the object's dynamic state. Some objects can be moved around by the player when dynamic is set to true.
    /// </summary>
    public bool Dynamic
    {
        get
        {
            if( !TryGetData( "dynamic", out bool isDynamic ) )
                return false;

            return isDynamic;
        }
        set { SetData( "dynamic", value ); }
    }

    /// <summary>
    /// Set/get visibility state of object
    /// </summary>
    public bool Visible
    {
        get
        {
            if( !TryGetData( "visible", out bool visible ) )
                return true;

            return visible;
        }
        set { SetData( "visible", value ); }
    }

    /// <summary>
    /// Set/get an object on fire, NOTE: does not work very well as of right now, fire is very small.
    /// </summary>
    public bool OnFire
    {
        get
        {
            if( !TryGetData( "onFire", out bool onFire ) )
                return false;

            return onFire;
        }
        set { SetData( "onFire", value ); }
    }

    /// <summary>
    /// Freeze an object into it's current position. or get it's status
    /// </summary>
    public bool Frozen
    {
        get
        {
            if( !TryGetData( "frozen", out bool frozen ) )
                return true;

            return frozen;
        }
        set { SetData( "frozen", value ); }
    }

    /// <summary>
    /// Move an object to a new XYZ location
    /// </summary>
    public Vector3 SlideToPosition
    {
        get
        {
            if( !TryGetData( "SlideToPosition", out Dictionary<string, object> data ) )
                return default;

            return new Vector3()
            {
                X = Convert.ToSingle( data[ "x" ] ),
                Y = Convert.ToSingle( data[ "y" ] ),
                Z = Convert.ToSingle( data[ "z" ] ),
            };
        }
        set
        {
            // No data changed

            Dictionary<string, object> dict = new Dictionary<string, object>()
            {
                [ "x" ] = value.X,
                [ "y" ] = value.Y,
                [ "z" ] = value.Z,
            };
            //Log.Important("SetData SlideToPosition ");
            SetData( "SlideToPosition", dict );
        }
    }

    /// <summary>
    /// Set the light color of the object, use null to reset it to default.
    /// </summary>
    public Rgb LightColor
    {
        get
        {
            if( !TryGetData( "lightColor", out Dictionary<string, object> data ) )
                return null;

            return new Rgb(
                Convert.ToInt32( data[ "r" ] ),
                Convert.ToInt32( data[ "g" ] ),
                Convert.ToInt32( data[ "b" ] )
            );
        }
        set
        {
            // if value is set to null, reset the data
            if( value == null )
            {
                SetData( "lightColor", null );
                return;
            }

            // No data changed
            if( LightColor != null && LightColor.Red == value.Red && LightColor.Green == value.Green &&
                LightColor.Blue == value.Blue )
                return;

            Dictionary<string, object> dict = new Dictionary<string, object>
            {
                {"r", value.Red},
                {"g", value.Green},
                {"b", value.Blue}
            };
            SetData( "lightColor", dict );
        }
    }

    public DynamicObject( Vector3 position, Vector3 rotation, int dimension, uint range, ulong entityType ) : base(
        entityType, position, dimension, range )
    {
        Rotation = rotation;
    }

    public void Destroy( )
    {
        AltEntitySync.RemoveEntity( this );
    }
}