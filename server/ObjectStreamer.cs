using System;
using AltV.Net;
using AltV.Net.EntitySync;
using System.Collections.Generic;
using System.Numerics;

namespace AltV.Streamers;

public enum TextureVariation
{
    Pacific = 0,
    Azure = 1,
    Nautical = 2,
    Continental = 3,
    Battleship = 4,
    Intrepid = 5,
    Uniform = 6,
    Classico = 7,
    Mediterranean = 8,
    Command = 9,
    Mariner = 10,
    Ruby = 11,
    Vintage = 12,
    Pristine = 13,
    Merchant = 14,
    Voyager = 15
}

public class Rgb : IWritable
{
    public int Red { get; set; }
    public int Green { get; set; }
    public int Blue { get; set; }

    public Rgb( int red, int green, int blue )
    {
        Red = red;
        Green = green;
        Blue = blue;
    }

    public void OnWrite( IMValueWriter writer )
    {
        writer.BeginObject();
        writer.Name( "Red" );
        writer.Value( Red );
        writer.Name( "Green" );
        writer.Value( Green );
        writer.Name( "Blue" );
        writer.Value( Blue );
        writer.EndObject();
    }
}

public static class ObjectStreamer
{
    /// <summary>
    /// Create a new dynamic object.
    /// </summary>
    /// <param name="model">The object model name.</param>
    /// <param name="position">The position to spawn the object at.</param>
    /// <param name="rotation">The rotation to spawn the object at(degrees).</param>
    /// <param name="dimension">The dimension to spawn the object in.</param>
    /// <param name="isDynamic">(Optional): Set object dynamic or not.</param>
    /// <param name="frozen">(Optional): Set object frozen.</param>
    /// <param name="lodDistance">(Optional): Set LOD distance.</param>
    /// <param name="lightColor">(Optional): set light color.</param>
    /// <param name="onFire">(Optional): set object on fire(DOESN'T WORK PROPERLY YET!)</param>
    /// <param name="textureVariation">(Optional): Set object texture variation.</param>
    /// <param name="visible">(Optional): Set object visibility.</param>
    /// <param name="streamRange">(Optional): The range that a player has to be in before the object spawns, default value is 400.</param>
    /// <returns>The newly created dynamic object</returns>
    public static DynamicObject CreateDynamicObject(
        string model, Vector3 position, Vector3 rotation, int dimension = 0, bool isDynamic = false, bool frozen = true,
        uint? lodDistance = null,
        Rgb lightColor = null, bool onFire = false, TextureVariation? textureVariation = null, bool visible = true,
        uint streamRange = 150
    )
    {
        DynamicObject obj = new DynamicObject( position, rotation, dimension, streamRange, AltStreamers.ENTITY_TYPE_DYNAMIC_OBJECT )
        {
            Model = model,
            Dynamic = isDynamic,
            Frozen = frozen,
            LodDistance = lodDistance ?? null,
            LightColor = lightColor ?? null,
            OnFire = onFire,
            TextureVariation = textureVariation ?? null,
            Visible = visible
        };

        AltEntitySync.AddEntity( obj );
        return obj;
    }

    public static WorldObject DeleteWorldObject( string model, Vector3 position, float radius = 5, uint range = 50, bool visible = false )
    {
        WorldObject obj = new WorldObject( model, position, range, radius, visible, AltStreamers.ENTITY_TYPE_WORLD_OBJECT );
        AltEntitySync.AddEntity( obj );
        return obj;

    }

    /// <summary>
    /// Destroy a dynamic object.
    /// </summary>
    /// <param name="obj">The object instance to destroy</param>
    /// <returns></returns>
    public static bool DestroyDynamicObject( DynamicObject obj )
    {
        AltEntitySync.RemoveEntity( obj );
        return true;
    }

    /// <summary>
    /// Get a dynamic object by it's ID.
    /// </summary>
    /// <param name="entityId">The ID of the entity.</param>
    /// <returns>The dynamic object or null if not found.</returns>
    public static T GetDynamicObjectByEntityId<T>( ulong entityId )
    {
        if( !AltEntitySync.TryGetEntity( entityId, AltStreamers.ENTITY_TYPE_DYNAMIC_OBJECT, out IEntity entity ) )
        {
            Console.WriteLine( $"[OBJECT-STREAMER] [GetDynamicObjectByEntityId] ERROR: Entity with ID {entityId} couldn't be found." );
            return default;
        }

        if( !( entity is T ) )
            return default;

        return ( T ) entity;
    }

    /// <summary>
    /// Destroy all created dynamic objects.
    /// </summary>
    public static void DestroyAllDynamicObjects<T>( )
    {
        foreach( T obj in GetAllDynamicObjects<T>() )
        {
            AltEntitySync.RemoveEntity( ( IEntity ) obj );
        }
    }

    /// <summary>
    /// Get all created dynamic objects.
    /// </summary>
    /// <returns>A list of dynamic objects.</returns>
    public static List<T> GetAllDynamicObjects<T>( )
    {
        List<T> objects = new List<T>();

        foreach( IEntity entity in AltEntitySync.GetAllEntities() )
        {
            if( entity.Type != AltStreamers.ENTITY_TYPE_DYNAMIC_OBJECT )
                continue;

            T obj = GetDynamicObjectByEntityId<T>( entity.Id );

            if( obj != null )
                objects.Add( obj );
        }

        return objects;
    }

    public static (T obj, float distance) GetClosestDynamicObjectOfType<T>( Vector3 pos )
    {
        T obj = default;
        float distance = 5000;

        foreach( T o in GetAllDynamicObjects<T>() )
        {
            if( o is not T )
                continue;

            float dist = Vector3.Distance( ( ( IEntity ) o ).Position, pos );

            if( dist < distance )
            {
                obj = o;
                distance = dist;
            }
        }

        return ( obj, distance );
    }
}