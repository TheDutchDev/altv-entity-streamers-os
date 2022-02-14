using System.Numerics;
using AltV.Net.EntitySync;

namespace AltV.Streamers;

public interface IDynamicObject : IEntity
{
    Vector3 Rotation { get; set; }
    string Model { get; set; }
    uint? LodDistance { get; set; }
    TextureVariation? TextureVariation { get; set; }
    bool Dynamic { get; set; }
    bool Visible { get; set; }
    bool OnFire { get; set; }
    bool Frozen { get; set; }
    Rgb LightColor { get; set; }

    void Destroy( );
}