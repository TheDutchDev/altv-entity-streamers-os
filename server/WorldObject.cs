using AltV.Net.EntitySync;
using System.Numerics;

namespace AltV.Streamers
{
    public class WorldObject : Entity, IEntity
    {
        /// <summary>
        /// The model of the object to search for
        /// </summary>
        public string Model
        {
            get
            {
                if( !TryGetData( "model", out string model ) )
                    return null;

                return model;
            }
            private set
            {
                // No data changed
                if( Model == value )
                    return;

                SetData( "model", value );
            }
        }

        /// <summary>
        /// The radius in which to search for the object to be deleted
        /// </summary>
        public float Radius
        {
            get
            {
                if( !TryGetData( "radius", out uint radius ) )
                    return 0;

                return radius;
            }
            private set
            {
                SetData( "radius", value );
            }
        }

        /// <summary>
        /// The radius in which to search for the object to be deleted
        /// </summary>
        public bool Visible
        {
            get
            {
                if( !TryGetData( "visible", out bool visible ) )
                    return true;

                return visible;
            }
            set
            {
                SetData( "visible", value );
            }
        }

        public WorldObject( string model, Vector3 position, uint range, float radius, bool visible, ulong entityType ) : base( entityType, position, 0, range )
        {
            Model = model;
            Radius = radius;
            Visible = visible;
        }

        /// <summary>
        /// Restore the world object.
        /// </summary>
        public void Restore( )
        {
            AltEntitySync.RemoveEntity( this );
        }
    }
}
